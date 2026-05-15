---
title: Back-of-Envelope Estimation
description: "The numbers, formulas, and worked examples for sizing any distributed system: latency table, storage units, availability downtime, QPS and storage estimation, with full walkthroughs for Twitter, YouTube, and WhatsApp."
parent: system-design
tags: [system-design, estimation, interviews]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

Back-of-envelope estimation is the skill of producing useful approximations quickly with minimal information. In a [system design](../) interview, it tells you whether you need 1 database or 10, whether bandwidth is your bottleneck or storage, and whether a naive design will fall over at the stated scale.

You do not need exact numbers. You need to be within an order of magnitude and to draw the right architectural conclusions from the result.

## Latency numbers every engineer should know

Originally from Jeff Dean (Google Fellow). Memorize the relative ratios; exact values shift as hardware improves.

| Operation | Latency | Relative to RAM |
| --- | --- | --- |
| L1 cache reference | 1 ns | 1x |
| L2 cache reference | 4 ns | 4x |
| Branch misprediction | 3 ns | 3x |
| Main memory reference | 100 ns | 100x |
| Compress 1 KB (Snappy) | 3 us | 3,000x |
| Read 1 MB sequentially from RAM | 10 us | 10,000x |
| SSD random read (4 KB) | 150 us | 150,000x |
| Read 1 MB sequentially from SSD | 1 ms | 1,000,000x |
| HDD seek | 10 ms | 10,000,000x |
| Read 1 MB sequentially from HDD | 20 ms | 20,000,000x |
| Round trip in same datacenter | 500 us | 500,000x |
| HTTP round trip across internet | 150 ms | 150,000,000x |

**Key ratios to remember:**
- RAM is 1,000x faster than SSD
- SSD is 1,000x faster than HDD
- Memory is 100,000x faster than a round trip across datacenters
- Anything that must be fast must live in memory or a nearby cache

## Storage units

```
1 KB  = 10^3 bytes     = ~1 thousand bytes
1 MB  = 10^6 bytes     = ~1 million bytes
1 GB  = 10^9 bytes     = ~1 billion bytes
1 TB  = 10^12 bytes    = ~1 trillion bytes
1 PB  = 10^15 bytes    = ~1 quadrillion bytes
1 EB  = 10^18 bytes    = ~1 quintillion bytes
```

**Memory aids:**
- A plain-text tweet (280 chars): ~300 bytes
- A high-quality photo (compressed): ~3 MB
- A 1-hour video (720p, compressed): ~1 GB
- A 1-hour video (4K, compressed): ~10 GB
- The entire English Wikipedia (text): ~20 GB
- Gmail's storage capacity per user: 15 GB

## Powers of two

Useful for estimating hash space and capacity:

| Power | Approximate value |
| --- | --- |
| 2^10 | 1 thousand (1 KB) |
| 2^20 | 1 million (1 MB) |
| 2^30 | 1 billion (1 GB) |
| 2^32 | 4 billion (max 32-bit int) |
| 2^40 | 1 trillion (1 TB) |
| 2^64 | 18 quintillion (max 64-bit int) |

Base62 encoding: 6 characters covers 62^6 = 56.8 billion URLs. Sufficient for any URL shortener.

## Availability and downtime

| Availability | Downtime per year | Downtime per month |
| --- | --- | --- |
| 99% | 3.65 days | 7.3 hours |
| 99.9% | 8.7 hours | 43.8 minutes |
| 99.99% | 52.6 minutes | 4.4 minutes |
| 99.999% | 5.3 minutes | 26 seconds |

Most consumer services target 99.99%. Financial systems often target 99.999%.

Multiple components in series multiply downtime: if your app server is 99.99% and your database is 99.99%, combined availability is 99.99% * 99.99% = 99.98%.

## Key formulas

### QPS (queries per second)

```python
seconds_per_day = 86_400  # memorize this

avg_qps = daily_requests / seconds_per_day
peak_qps = avg_qps * peak_multiplier  # typically 2x-5x for consumer apps
```

### Storage

```python
storage = daily_writes * avg_record_bytes * retention_days
# add replication factor (typically 3x for durability)
total_storage = storage * replication_factor
```

### Bandwidth

```python
read_bandwidth = peak_read_qps * avg_response_bytes
write_bandwidth = peak_write_qps * avg_request_bytes
# compare to NIC capacity: 1 Gbps = 125 MB/s
```

### Number of servers

```python
import math
servers = math.ceil(peak_qps / rps_per_server)
# typical stateless API server: 500-5000 RPS depending on request complexity
# add 50% headroom for failures and traffic spikes
```

## Worked example 1: Twitter

**Assumptions (state these out loud):**
- 300M DAU
- Average user views 20 tweets/day, sends 0.1 tweets/day
- Average tweet: 300 bytes text + 50% include a photo (3 MB) + 10% include video (30 MB)
- Retain tweet data indefinitely; media for 5 years

**QPS:**
```
Tweet writes:
  300M DAU * 0.1 tweets/day = 30M tweets/day
  30M / 86400 = 347 write QPS
  Peak (3x): ~1000 write QPS

Tweet reads (feed):
  300M DAU * 20 views/day = 6B feed reads/day
  6B / 86400 = 69,000 read QPS
  Peak (3x): ~207,000 read QPS
  Read/write ratio: 69,000 / 347 = ~200:1
```

**Storage:**
```
Text tweets:
  30M tweets/day * 300 bytes = 9 GB/day
  Per year: 9 GB * 365 = 3.3 TB/year

Photos (50% of tweets):
  15M photos/day * 3 MB = 45 TB/day
  Per year: 45 TB * 365 = 16.4 PB/year

Videos (10% of tweets, 5 min avg = 150 MB compressed):
  3M videos/day * 150 MB = 450 TB/day
  Per year: 450 TB * 365 = 164 PB/year

5-year total media: (16.4 + 164) * 5 = ~902 PB
```

**Architectural conclusions:**
- 200:1 read/write ratio: aggressive caching is the primary strategy; pre-computed feeds (fanout on write) for most users
- 207K read QPS: needs a CDN + Redis feed cache fleet
- 902 PB media: object storage (S3) with lifecycle tiering to cold storage; CDN in front for frequently accessed media

## Worked example 2: YouTube

**Assumptions:**
- 2B logged-in users, 500M DAU
- 500 hours of video uploaded every minute
- 1B hours of video watched per day
- 1080p video: 2 GB/hour source; transcoded to 5 resolutions avg 0.5 GB/hour each

**Upload QPS:**
```
500 hours/min uploaded = 8.3 hours/sec = 30,000 hours/hour

Upload bandwidth:
  500 hours/min * 2 GB/hour = 1000 GB/min = 16.7 GB/sec
  That is 133 Gbps of ingest -- needs a large fleet of ingest servers
```

**Transcoding storage:**
```
Per uploaded hour, store source + 5 resolutions:
  2 GB + (5 * 0.5 GB) = 4.5 GB per uploaded hour

Daily: 500 hours/min * 60 min * 4.5 GB = 135,000 GB/day = 135 TB/day
Annual: 135 TB * 365 = ~49 PB/year
5-year: ~247 PB
```

**Watch QPS:**
```
1B hours watched/day = 41.7M hours/hour = 11,574 hours/second

At 4 Mbps average stream:
  11,574 hours/sec * 3600 sec/hr * 4 Mbps = ~166 Tbps delivery bandwidth
  This is CDN-scale; no single company's origin can serve this
```

**Architectural conclusions:**
- 133 Gbps ingest: dedicated ingest fleet, pre-signed S3 upload URLs from client
- Transcoding: GPU fleet (NVENC) for real-time transcoding; Kafka pipeline
- 247 PB storage: object storage with tiered pricing (hot/warm/cold); lifecycle rules
- 166 Tbps delivery: multi-CDN; Netflix Open Connect equivalent; edge caching of popular segments approaches 100% hit rate

## Worked example 3: WhatsApp

**Assumptions:**
- 2B users, 1B DAU
- Each DAU sends 40 messages/day; 50% include media
- Message text: 100 bytes; media attachment: 500 KB average
- Store messages 30 days; media 90 days

**Write QPS:**
```
Messages:
  1B DAU * 40 messages/day = 40B messages/day
  40B / 86400 = 463,000 message write QPS
  Peak (2x): ~926,000 write QPS -- this is the key scaling challenge

Media:
  20B media messages/day * 500 KB = 10 PB/day media ingested
```

**Storage:**
```
Message text (30-day retention):
  40B/day * 100 bytes * 30 days = 120 TB

Media (90-day retention):
  20B/day * 500 KB * 90 days = 900 PB
```

**Delivery:**
```
If each message is delivered to 1.5 recipients on average:
  463,000 sends/sec * 1.5 = 694,000 deliveries/sec
```

**Architectural conclusions:**
- 926K write QPS: cannot use a relational DB. Cassandra (LSM-tree, write-optimized, horizontally scalable) is the canonical choice; WhatsApp uses Erlang/Mnesia; Signal uses a PostgreSQL-based store
- 10 PB/day media: media is stored in object storage (separate from messages); CDN for delivery
- 900 PB media retention: lifecycle tiering to cold storage after 30 days; only 30-day active media in hot tier
- Connection management: 1B concurrent WebSocket connections is impossible on a single server fleet; shard by user ID range, ~1M connections per server, 1000 servers for 1B users

## Common estimation mistakes

**Forgetting the peak multiplier.** Average QPS is never the design target. Consumer apps spike 2-5x on peak hours/events. Infrastructure is sized for peak, not average.

**Ignoring replication.** Storage for 100 GB of data is actually 300 GB (3x replication factor). Always multiply by the replication factor.

**Conflating throughput with latency.** A system that can process 100K QPS might still have p99 latency of 500ms if requests queue behind slow ones. Throughput and latency are independent dimensions.

**Underestimating media.** Text is cheap. Images, audio, and video dominate storage costs by orders of magnitude. Always calculate text and media separately.

**Not stating assumptions.** An estimate with no stated assumptions is wrong. State each assumption. Interviewers will correct you if they disagree, which is the point.

**Getting stuck on precision.** "Is it 3 servers or 4?" does not matter. "Is it 3 servers or 300?" does. Estimation rounds to the nearest order of magnitude.

## Quick reference: seconds per time unit

```
1 minute   = 60 seconds
1 hour     = 3,600 seconds
1 day      = 86,400 seconds    (memorize: ~10^5)
1 month    = 2,592,000 seconds (~2.5 * 10^6)
1 year     = 31,536,000 seconds (~3 * 10^7)
```

## References

- [Numbers Every Programmer Should Know, Jeff Dean](https://static.googleusercontent.com/media/sre.google/en//static/pdf/performance.pdf)
- [System Design Interview, Alex Xu, Chapter 2: Back-of-the-Envelope Estimation](https://bytebytego.com/)
- [Latency Numbers Every Programmer Should Know, interactive](https://colin-scott.github.io/personal_website/research/interactive_latency.html)
- [AWS Calculator for reference](https://calculator.aws/pricing/2/home)

## Related topics

- [Interview Framework](../interview-framework/), how estimation fits into the 4-step interview approach
- [Scalability](../scalability/), what the numbers tell you about scaling strategy
- [Databases at Scale](../databases/), how storage estimates drive sharding decisions
- [Caching](../caching/), why read/write ratios determine caching strategy
