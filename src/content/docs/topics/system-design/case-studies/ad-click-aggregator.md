---
title: "Case Study: Ad Click Aggregator"
description: "Design walkthrough for an ad click aggregation system: idempotent click counting with Redis deduplication, time-windowed stream aggregation via Flink, lambda architecture merging real-time and batch counts, and the billing implications that make exactly-once semantics non-negotiable."
parent: case-studies
tags: [system-design, case-studies, interviews]
status: draft
created: 2026-05-21
updated: 2026-05-21
---

The ad click aggregator looks like a simple counter at first glance: a click arrives, increment a number. The depth appears when you consider that clicks affect billing. If the same click is counted twice, an advertiser is charged twice. If a click is lost, revenue is forfeited. The Kafka at-least-once delivery guarantee means duplicate events are a certainty, not a possibility. Idempotency becomes the first thing to design, not an afterthought.

## Series concepts

### Introduced here

- **Time-windowed aggregation**: clicks are counted per ad per time window (minute, hour, day) and per dimension (geography, device, publisher). This requires event-time semantics: a click that arrives late (network delay, client buffer) must be assigned to the window it belongs to, not the window it arrived in.
- **Idempotent click counting**: Kafka at-least-once delivery means the same click event can arrive twice. A client-side UUID per click, checked against a short-lived Redis set keyed by `(ad_id, minute_bucket)`, filters duplicates before aggregation.
- **Lambda architecture**: two parallel paths for the same data. The speed layer (Redis) maintains real-time counts for the past hour, served with sub-millisecond latency. The batch layer (Spark job) recomputes accurate historical counts nightly. The query layer merges both for any time range.
- **Count-Min Sketch for approximate counting**: a probabilistic data structure that answers "how many times has this ad been clicked?" in O(1) space per query with a bounded overcount error (~1-2%). Useful for real-time dashboards where approximate counts are acceptable and memory is constrained.
- **Write amplification**: one click fans out to multiple aggregation dimensions. A single click on ad 12345 from a user in Germany on a mobile device generates writes to: `clicks:ad:12345:minute`, `clicks:ad:12345:hour`, `clicks:ad:12345:day`, `clicks:ad:12345:country:DE`, `clicks:ad:12345:device:mobile`. Design for this fan-out from the start.

### Carried forward from prior entries

- **Kafka click event stream**: same async pipeline from [URL Shortener](./url-shortener/). The Bitly analytics pipeline publishes one event per redirect; here each click is a higher-stakes event that must be counted exactly once across multiple dimensions.
- **Consistent hashing for partitioning**: Kafka partitions clicks by `ad_id` so all events for a given ad flow to the same consumer partition. Same sharding concept from [URL Shortener](./url-shortener/) and [Web Crawler](./web-crawler/).
- **Redis for real-time counts**: same write cache pattern, now used for accumulation rather than simple key-value lookup. Redis INCR is atomic and O(1).
- **Snowflake ID generation**: click event IDs use the same distributed ID service for deduplication keys.

## Clarifying questions

Ask these before drawing anything:

- **Billing implications**: are click counts used directly for advertiser billing, or is billing a separate reconciliation process?
- **Query patterns**: do advertisers query in real time, or is a 1-hour delay acceptable?
- **Aggregation dimensions**: by time only, or also by geography, device, publisher?
- **Click validation**: fraud detection? Bot filtering? Out-of-scope or in-scope?
- **Retention**: how long must raw click events be retained?

What the answers reveal:
- Direct billing means exactly-once semantics are required end-to-end, not just best-effort
- Real-time queries drive the speed layer requirement; batch-only is simpler but insufficient
- Each additional aggregation dimension multiplies the write amplification factor
- Fraud detection is a common follow-up scope expansion that adds a classification step before the counting pipeline
- 90-day raw retention at 5B clicks/day is ~90 TB; compression brings this to ~30-45 TB

For this walkthrough: 5B clicks/day, direct billing use, real-time queries required for past 1 hour, aggregation by time, country, and device, no fraud detection in scope, 90-day raw retention.

## Estimation

```
Click ingestion QPS:
  5B clicks/day / 86,400 = 57,870 click QPS

Write amplification:
  Each click fans out to 5 aggregation dimensions:
    ad+minute, ad+hour, ad+day, ad+country, ad+device
  57,870 * 5 = 289,350 aggregation writes/sec

Kafka throughput:
  57,870 events/sec * 200 bytes/event = 11.6 MB/sec
  Kafka handles this comfortably on a 3-node cluster

Deduplication window:
  Need to detect duplicates within a 1-hour window
  57,870 click/sec * 3,600 sec = 208M unique click IDs per hour
  Redis set per (ad_id, minute_bucket): ~10K entries/bucket avg

Storage:
  Raw events: 5B * 200 bytes = 1 TB/day
  90-day retention: 90 TB raw (compressed ~30 TB)
  Aggregated counts in ClickHouse: much smaller (summary rows)
```

**Conclusion**: the write amplification (289K aggregation writes/sec) is the primary scaling concern, not raw click ingestion. The deduplication layer must be fast (Redis) and bounded (TTL on dedup keys to prevent unbounded growth).

## High-level design

```mermaid
flowchart TD
    Browser -->|click event + UUID| ClickAPI[Click Ingestion API]
    ClickAPI -->|validate ad_id + publisher| AdDB[(Ad Metadata DB)]
    ClickAPI -->|publish to| ClickTopic[Kafka: click-events\npartitioned by ad_id]

    ClickTopic --> FlinkJob[Flink: aggregation job]
    FlinkJob -->|1-min tumbling window aggregates| AggTopic[Kafka: aggregated-clicks]

    AggTopic --> ClickHouse[(ClickHouse: historical counts)]
    AggTopic --> RedisSpeed[(Redis: real-time counts\npast 1 hour)]

    ClickTopic --> SparkBatch[Spark: nightly batch recompute]
    SparkBatch -->|accurate daily totals| ClickHouse

    QueryService -->|range overlaps recent hour| RedisSpeed
    QueryService -->|historical range| ClickHouse
    QueryService -->|merge| APIResponse[API Response]
```

API endpoints:

```
POST /clicks
  body:    { ad_id, publisher_id, event_id (UUID), user_agent, geo_ip, timestamp }
  returns: { status: "accepted" }

GET /ads/{ad_id}/clicks
  params:  start_time, end_time, granularity (minute|hour|day), dimensions (country,device)
  returns: { ad_id, time_series: [{ timestamp, count, breakdown: {...} }] }

GET /ads/{ad_id}/clicks/realtime
  returns: { ad_id, last_minute, last_hour, last_day }
```

## Deep dive: idempotent click ingestion

Each click event carries a client-generated UUID. The deduplication check happens at the Flink consumer, not at the ingestion API (to keep the API on the fast path):

```python
import redis
import json
from datetime import datetime, timezone

r = redis.Redis(host='redis-dedup', decode_responses=True)

def process_click_event(event: dict) -> bool:
    """Returns True if this is a new (non-duplicate) click."""
    ad_id = event["ad_id"]
    event_id = event["event_id"]  # client-generated UUID
    event_ts = datetime.fromisoformat(event["timestamp"])

    # Bucket by minute for dedup key scoping
    minute_bucket = event_ts.strftime("%Y%m%d%H%M")
    dedup_key = f"dedup:{ad_id}:{minute_bucket}"

    # SADD returns 1 if element was added (new), 0 if already present (duplicate)
    is_new = r.sadd(dedup_key, event_id)

    if is_new:
        # Set TTL on first add to bound memory usage
        r.expire(dedup_key, 3600)  # 1 hour: enough to catch late-arriving duplicates

    return bool(is_new)

def handle_click(event: dict):
    if not process_click_event(event):
        return  # duplicate, skip

    # Fan out to aggregation dimensions
    fanout_to_aggregations(event)
```

Why client-side UUID rather than server-assigned ID: network retries. If the client's POST to `/clicks` times out, it retries. Without a client-side UUID, the server sees two distinct requests and counts both. With the UUID, the deduplication set catches the retry even if it arrives minutes later.

The 1-hour TTL on the dedup set means duplicates arriving more than one hour late will slip through. This is an explicit tradeoff: duplicate events that arrive within 1 hour are filtered (covers 99.9%+ of network retries), and late-arriving duplicates beyond 1 hour are corrected by the nightly Spark batch job which re-reads the raw Kafka log and recomputes exact counts.

## Deep dive: Flink stream aggregation

The Flink job aggregates clicks into 1-minute tumbling windows and fans out to each aggregation dimension:

```python
from pyflink.datastream import StreamExecutionEnvironment
from pyflink.datastream.window import TumblingEventTimeWindows
from pyflink.common.watermark_strategy import WatermarkStrategy
from datetime import timedelta

env = StreamExecutionEnvironment.get_execution_environment()

# Allow events up to 5 minutes late (handles clock skew and buffered mobile clicks)
watermark_strategy = (WatermarkStrategy
    .for_bounded_out_of_orderness(timedelta(minutes=5))
    .with_timestamp_assigner(lambda event, _: event["timestamp_ms"]))

click_stream = (env
    .add_source(kafka_source("click-events"))
    .assign_timestamps_and_watermarks(watermark_strategy))

# Aggregate by ad_id + 1-minute tumbling window
def aggregate_by_ad(stream):
    return (stream
        .filter(lambda e: e["is_new"])  # deduplication already applied upstream
        .map(lambda e: ((e["ad_id"],), 1))
        .key_by(lambda x: x[0])
        .window(TumblingEventTimeWindows.of(timedelta(minutes=1)))
        .sum(1))

# Aggregate by ad_id + country + 1-minute window
def aggregate_by_ad_country(stream):
    return (stream
        .filter(lambda e: e["is_new"])
        .map(lambda e: ((e["ad_id"], e["country"]), 1))
        .key_by(lambda x: x[0])
        .window(TumblingEventTimeWindows.of(timedelta(minutes=1)))
        .sum(1))

# Emit all aggregations to the aggregated-clicks Kafka topic
aggregated = aggregate_by_ad(click_stream).union(
    aggregate_by_ad_country(click_stream),
    aggregate_by_ad_device(click_stream),
)
aggregated.add_sink(kafka_sink("aggregated-clicks"))
```

The 5-minute watermark means the job waits up to 5 minutes after a window closes before emitting the final count. Events arriving after 5 minutes are treated as late and handled by the batch recompute. This tradeoff balances latency (dashboards update within 6 minutes) against correctness (captures most mobile buffering scenarios).

## Deep dive: lambda architecture query merge

The query service merges real-time Redis counts with historical ClickHouse counts based on the requested time range:

```python
from datetime import datetime, timedelta, timezone

REALTIME_HORIZON = timedelta(hours=1)

def query_clicks(ad_id: str, start: datetime, end: datetime, granularity: str) -> list:
    now = datetime.now(timezone.utc)
    realtime_cutoff = now - REALTIME_HORIZON

    results = []

    # Historical portion: ClickHouse
    if start < realtime_cutoff:
        historical_end = min(end, realtime_cutoff)
        rows = clickhouse_client.execute("""
            SELECT
                toStartOfInterval(window_start, INTERVAL 1 {gran}) AS bucket,
                sum(click_count) AS clicks
            FROM click_aggregates
            WHERE ad_id = %(ad_id)s
              AND window_start >= %(start)s
              AND window_start < %(end)s
            GROUP BY bucket
            ORDER BY bucket
        """, {"ad_id": ad_id, "start": start, "end": historical_end, "gran": granularity})
        results.extend(rows)

    # Real-time portion: Redis
    if end > realtime_cutoff:
        rt_start = max(start, realtime_cutoff)
        rt_rows = query_redis_realtime(ad_id, rt_start, end, granularity)
        results.extend(rt_rows)

    return merge_and_sort(results)

def query_redis_realtime(ad_id: str, start: datetime, end: datetime, granularity: str) -> list:
    buckets = generate_minute_buckets(start, end)
    results = []
    for bucket in buckets:
        count = r.get(f"clicks:{ad_id}:{bucket}") or 0
        results.append({"bucket": bucket, "clicks": int(count)})
    return results
```

The merge is simple because the two data sources cover non-overlapping time ranges. The only edge case is the boundary minute (currently being aggregated by Flink): counts for the current minute may be incomplete in both Redis and ClickHouse. The API response includes a `last_complete_minute` timestamp so dashboards can indicate incomplete data.

## Failure modes

**Kafka consumer lag**: if the Flink job falls behind, aggregation windows are delayed. Dashboards show stale data. Monitor Kafka consumer group lag; alert at 5 minutes of lag. Scale Flink task managers horizontally: add more parallelism on the `ad_id` key space.

**Redis dedup set overflow**: if dedup TTLs are not set correctly, sets grow unbounded. The `expire` call on first insert handles this. As a safety net, monitor Redis memory usage and alert at 80% capacity.

**ClickHouse write failure**: aggregated counts from the Flink job are not stored. The raw Kafka log is the source of truth; the batch recompute job re-derives all counts from raw events. ClickHouse writes are idempotent (upsert by `(ad_id, window_start, dimension)` primary key).

**Late-arriving events beyond watermark**: Flink discards events that arrive more than 5 minutes after their window closed. These events show up in the nightly Spark batch recompute, which reads the full raw Kafka log and produces exact counts for every completed day. The real-time counts are acknowledged as approximate in the API contract.

## Key takeaways

**Idempotency is the first design decision, not the last.** The Kafka at-least-once guarantee combined with billing implications means duplicate suppression must be explicit. The client-side UUID plus the server-side dedup set is the canonical pattern.

**Write amplification multiplies with each aggregation dimension.** A single click at 57,870 QPS becomes 289,350 aggregation writes/sec with five dimensions. State this number early and design storage (ClickHouse, Redis) to absorb it rather than discovering it after the fact.

**Lambda architecture is the correct tradeoff for billing accuracy.** Real-time approximate counts serve dashboards. Accurate batch recompute serves billing reconciliation. Do not try to make the real-time path exact; accept the tradeoff explicitly and build the batch correction path.

**Count-Min Sketch is the right structure for per-ad approximate counts.** When memory is constrained and exact counts are not needed for every ad (billions of ads, most with zero clicks), the Count-Min Sketch provides O(1) space per query with a bounded overcount error.

**The aggregation pipeline is the analytics pipeline from URL Shortener at billing scale.** The structural similarity is direct: event published to Kafka, consumer updates a store. The difference is that billing implications make every design decision more consequential.

## References

- [Real-time Data Infrastructure at Uber](https://eng.uber.com/real-time-exactly-once-ad-event-processing/)
- [Lambda Architecture (Nathan Marz)](http://nathanmarz.com/blog/how-to-beat-the-cap-theorem.html)
- [ClickHouse for Analytical Workloads](https://clickhouse.com/docs/en/intro)
- [Count-Min Sketch (Cormode & Muthukrishnan)](https://dimacs.rutgers.edu/~graham/pubs/papers/cmencyc.pdf)
- [System Design Interview Vol 2, Alex Xu, Chapter 11](https://bytebytego.com/)

## Related topics

- [Case Study: URL Shortener](./url-shortener/), the analytics pipeline this builds on
- [Case Study: Web Crawler](./web-crawler/), consistent hashing and Kafka partitioning patterns
- [Message Queues](../message-queues/), Kafka at-least-once delivery and consumer groups
- [Databases](../databases/), ClickHouse columnar storage for aggregation queries
- [Caching](../caching/), Redis for real-time accumulation and dedup sets
- [Consistent Hashing](../consistent-hashing/), partitioning aggregation workers by ad_id
