---
title: "Case Study: Facebook Post Search"
description: "Design walkthrough for social search at scale: inverted index construction with BM25 ranking, document-sharded index fanout, Kafka-driven index update pipeline, typeahead with Redis prefix cache, and privacy filtering that respects Facebook's friend-visibility model."
parent: case-studies
tags: [system-design, case-studies, interviews]
status: draft
created: 2026-05-21
updated: 2026-05-21
---

Search is the query interface to a knowledge base, and social search adds two complications that make it harder than web search: the corpus changes in real time (100M posts per day), and every result must pass a privacy filter (only show posts the querying user is allowed to see). The inverted index is the foundational data structure. The hard problems are keeping it fresh (Kafka-driven index updates), ranking it well (BM25 plus social affinity signals), and filtering it correctly (privacy). The indexing pipeline looks structurally identical to the [URL Shortener](./url-shortener/) analytics pipeline: event published to Kafka, consumer updates a store. Understanding that structural reuse is the central insight.

## Series concepts

### Introduced here

- **Inverted index and posting lists**: for each word in the corpus, the inverted index stores a sorted list of document IDs that contain that word (a posting list). Boolean queries (AND, OR) become set intersections and unions over posting lists. Posting lists are compressed with delta encoding, storing differences between consecutive document IDs rather than absolute values, saving 40-60% of space.
- **Index sharding strategies**: two options. Shard by term: all documents containing a given term reside on the same shard (fast for AND queries, catastrophic for hot terms like "the"). Shard by document ID: all terms for a given document are co-located on one shard (easy deletion, requires fan-out for multi-term queries). Production systems use document sharding with fan-out: query all N shards in parallel, merge results.
- **BM25 ranking**: an improvement over TF-IDF that accounts for document length normalization and term saturation. Score(doc, query) is a sum over query terms of IDF * TF-normalized. Adding social affinity (do you interact with this poster?) and recency decay produces the final ranking.
- **Typeahead with prefix caching**: each keystroke triggers a prefix query. The top-10 results for each prefix are cached in Redis with a 5-minute TTL. Hot prefixes (typed millions of times per hour) are refreshed proactively by a background job; cold prefixes are filled on first miss.
- **Privacy filtering**: Facebook posts have visibility (public, friends-only, custom). A post may be in the index but not returnable to a given query user. Post-query filtering retrieves top-N candidates from the index, applies visibility checks, discards ineligible results, and re-ranks. Pre-query fanout indexing (only index to authorized users) is prohibitively expensive for public posts.

### Carried forward from prior entries

- **Kafka indexing pipeline**: same async event pipeline from [URL Shortener](./url-shortener/), now driving search index updates instead of click analytics. A post-created event flows through Kafka to an index worker that updates posting lists in Elasticsearch.
- **Consistent hashing for index sharding**: index shards are assigned to nodes using the same consistent hash ring concept from [URL Shortener](./url-shortener/) and [Web Crawler](./web-crawler/). Adding index nodes redistributes only the shards on the affected ring segment.
- **Redis result cache**: same cache pattern from [URL Shortener](./url-shortener/) and [Ticketmaster](./ticketmaster/). Popular queries are cached in Redis to absorb repeated identical searches.
- **Snowflake ID generation**: document IDs for indexing use the same distributed ID service, providing monotonically increasing IDs that make posting list delta encoding efficient (IDs are already sorted by creation time within each shard).

## Clarifying questions

Ask these before drawing anything:

- **Search scope**: all posts, or only public posts, or posts from friends and friends-of-friends?
- **Latency target**: what is the acceptable p99 query latency?
- **Index freshness**: how quickly after posting must a post appear in search results?
- **Ranking signals**: text relevance only, or also social signals (engagement, affinity)?
- **Typeahead**: required? Per-user personalization or global?
- **Languages**: single-language corpus, or multilingual? (Affects tokenization and stemming.)

What the answers reveal:
- Privacy scope determines the complexity of the post-query filter and whether per-user index fanout is even considered
- A 100ms p99 target with 20-shard fanout means each shard must respond in under 80ms (leaving 20ms for merge and rank)
- Sub-second index freshness requires a streaming pipeline; batch indexing cannot meet it
- Social ranking signals add a separate affinity score computation that must be cached per (querier, post_author) pair
- Multilingual corpus requires per-language tokenization pipelines and language detection

For this walkthrough: all posts with friend/public visibility filtering, 100ms p99, index freshness within 30 seconds of posting, BM25 plus social affinity ranking, typeahead with global (non-personalized) suggestions, English-only corpus.

## Estimation

```
Index write QPS (new posts):
  100M posts/day / 86,400 = 1,157 write QPS (index updates)

Search query QPS:
  2B searches/day / 86,400 = 23,148 search QPS

Index shard fan-out:
  20 shards * 23,148 = 462,960 shard queries/sec

Corpus size:
  3B users, avg 10 posts/user still active in index = 30B indexed documents
  Avg post: 150 characters = 30 unique terms after tokenization
  Posting list entries: 30B docs * 30 terms = 900B postings

Typeahead:
  Each search generates ~5 keystrokes before submission
  23,148 * 5 = 115,740 typeahead QPS
  Distinct hot prefixes: "fa", "fac", "face"... ~10M distinct prefixes
  Redis cache for top-10 per prefix: 10M * 200 bytes = 2 GB (fits in one Redis node)

Latency budget (100ms p99):
  Network to query service:    5ms
  Query parse + tokenize:      2ms
  Fan-out to 20 shards:        60ms (parallel)
  Merge + BM25 rank:           10ms
  Privacy filter:              15ms
  Network back to client:      5ms
  Buffer:                      3ms
```

**Conclusion**: the index fan-out at 462K shard queries/sec is the capacity driver. Each shard (Elasticsearch node) handles ~23K queries/sec, which requires a large Elasticsearch cluster. The privacy filter adds 15ms to the p99 path and must be implemented with pre-fetched permission data, not synchronous friend-graph queries.

## High-level design

```mermaid
flowchart TD
    User -->|POST /posts| PostService
    PostService -->|write post record| PostDB[(PostgreSQL: posts)]
    PostService -->|publish post-created event| PostTopic[Kafka: post-created]

    PostTopic --> IndexWorker[Index Worker]
    IndexWorker -->|tokenize + normalize| Tokenizer
    Tokenizer -->|bulk index API| ESCluster[Elasticsearch\n20 shards]

    User -->|GET /search?q=...| QueryService
    QueryService -->|check cache| RedisCache[(Redis: query result cache)]
    RedisCache -->|cache miss| QueryService
    QueryService -->|fan-out to all 20 shards| ESCluster
    ESCluster -->|top-K per shard| QueryService
    QueryService -->|merge + BM25 rank| Ranker
    Ranker -->|top-100 candidates| PrivacyFilter
    PrivacyFilter -->|visibility check| FriendGraph[(Friend Graph Service)]
    PrivacyFilter -->|filtered results| QueryService
    QueryService -->|cache result + return| User

    User -->|GET /search/typeahead?prefix=fa| TypeaheadService
    TypeaheadService -->|GET typeahead:{prefix}| RedisTypeahead[(Redis: typeahead cache)]
```

API endpoints:

```
GET /search
  params:  q (query string), limit (default 20), cursor (pagination)
  returns: { results: [{ post_id, snippet, author, timestamp, score }], next_cursor }

GET /search/typeahead
  params:  prefix (partial query string), limit (default 10)
  returns: { suggestions: [{ query, frequency }] }

POST /posts
  body:    { content, visibility: "public" | "friends" | "custom", audience_ids? }
  returns: { post_id, created_at }
```

## Deep dive: inverted index and posting lists

The inverted index maps each term to a sorted list of document IDs (posting list). Delta encoding compresses consecutive IDs by storing their differences:

```python
def delta_encode(doc_ids: list[int]) -> list[int]:
    """Convert sorted absolute doc IDs to delta-encoded differences."""
    if not doc_ids:
        return []
    encoded = [doc_ids[0]]
    for i in range(1, len(doc_ids)):
        encoded.append(doc_ids[i] - doc_ids[i-1])
    return encoded

def delta_decode(deltas: list[int]) -> list[int]:
    """Reconstruct absolute doc IDs from delta-encoded list."""
    if not deltas:
        return []
    ids = [deltas[0]]
    for delta in deltas[1:]:
        ids.append(ids[-1] + delta)
    return ids

# Example: posting list for "python" contains doc IDs [1001, 1003, 1007, 1015, 1016]
# Delta encoded: [1001, 2, 4, 8, 1]
# Savings: large gaps encode as small numbers, compressing well with varint encoding

def and_query(posting_lists: list[list[int]]) -> list[int]:
    """Intersect multiple posting lists (AND query)."""
    if not posting_lists:
        return []
    # Sort by length: start with the shortest list to minimize work
    sorted_lists = sorted(posting_lists, key=len)
    result = set(sorted_lists[0])
    for lst in sorted_lists[1:]:
        result &= set(lst)
        if not result:
            return []  # early exit: empty intersection
    return sorted(result)
```

Elasticsearch handles posting list management internally. The key architectural decision is the sharding strategy. Sharding by document ID (Elasticsearch default) means a two-term AND query fans out to all 20 shards, each returning its local top-K candidates, and the query service merges them:

```python
import asyncio
import aiohttp

async def fan_out_query(query_terms: list[str], top_k: int = 100) -> list[dict]:
    shard_urls = get_all_shard_urls()  # 20 shard endpoints

    async def query_shard(session, shard_url: str) -> list[dict]:
        payload = {
            "query": {"match": {"content": " ".join(query_terms)}},
            "size": top_k,
            "_source": ["post_id", "author_id", "created_at", "content_snippet"],
        }
        async with session.post(f"{shard_url}/_search", json=payload) as resp:
            data = await resp.json()
            return data["hits"]["hits"]

    async with aiohttp.ClientSession() as session:
        shard_results = await asyncio.gather(*[
            query_shard(session, url) for url in shard_urls
        ])

    # Merge: collect all candidates, sort by BM25 score + social signals
    all_hits = [hit for shard in shard_results for hit in shard]
    return sorted(all_hits, key=lambda h: h["_score"], reverse=True)[:top_k]
```

## Deep dive: BM25 ranking with social signals

BM25 scores text relevance. Social signals adjust the score for the querying user's context:

```python
import math

def bm25_score(tf: int, df: int, N: int, dl: int, avgdl: float,
               k1: float = 1.2, b: float = 0.75) -> float:
    """
    BM25 score for a single term.
    tf: term frequency in document
    df: document frequency (how many docs contain this term)
    N: total documents in corpus
    dl: document length (number of tokens)
    avgdl: average document length across corpus
    """
    idf = math.log((N - df + 0.5) / (df + 0.5) + 1)
    tf_normalized = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (dl / avgdl)))
    return idf * tf_normalized

def final_score(bm25: float, post_id: str, querier_id: str, post_created_at: float) -> float:
    """Combine BM25 with social affinity and recency."""
    # Social affinity: how often has the querier interacted with this author?
    # Pre-computed and cached: GET affinity:{querier_id}:{author_id}
    author_id = get_post_author(post_id)
    affinity = float(redis.get(f"affinity:{querier_id}:{author_id}") or 0.0)

    # Recency decay: log curve, recent posts score higher
    age_hours = (time.time() - post_created_at) / 3600
    recency = 1.0 / (1.0 + math.log(1 + age_hours))

    # Engagement velocity: clicks/views in first hour (proxy for quality)
    velocity = float(redis.get(f"velocity:{post_id}") or 0.5)

    return bm25 * (1 + 0.3 * affinity) * recency * (0.7 + 0.3 * velocity)
```

The affinity scores are pre-computed by a background job that reads the interaction graph (likes, comments, shares, messages) and writes per-pair affinity scores to Redis. These are not computed at query time: doing so would require a graph traversal on every query.

## Deep dive: typeahead prefix caching

Typeahead must return results in under 50ms from the browser's perspective. At 115K prefix QPS, this requires a dedicated caching layer:

```python
def typeahead(prefix: str, limit: int = 10) -> list[dict]:
    cache_key = f"typeahead:{prefix.lower()}"
    cached = redis.get(cache_key)
    if cached:
        return json.loads(cached)

    # Cache miss: query Elasticsearch for top completions
    results = elasticsearch.search(
        index="search-queries",
        body={
            "query": {"prefix": {"query_text": prefix.lower()}},
            "aggs": {
                "top_queries": {
                    "terms": {"field": "query_text", "size": limit, "order": {"_count": "desc"}}
                }
            },
            "size": 0,
        }
    )

    suggestions = [
        {"query": bucket["key"], "frequency": bucket["doc_count"]}
        for bucket in results["aggregations"]["top_queries"]["buckets"]
    ]

    # Cache with 5-minute TTL
    redis.setex(cache_key, 300, json.dumps(suggestions))
    return suggestions
```

Hot prefixes are refreshed proactively. A background job tracks the 10,000 most-typed prefixes per hour (using a Redis sorted set keyed by frequency) and re-warms their cache entries before the TTL expires:

```python
def proactive_typeahead_refresh():
    """Called every 4 minutes by a cron job."""
    hot_prefixes = redis.zrevrange("typeahead:hot_prefixes", 0, 9999, withscores=True)
    for prefix_bytes, frequency in hot_prefixes:
        prefix = prefix_bytes.decode()
        results = compute_typeahead(prefix)
        redis.setex(f"typeahead:{prefix}", 300, json.dumps(results))
```

## Failure modes

**Index worker lag**: if the Kafka consumer for the index worker falls behind, newly posted content does not appear in search results immediately. Monitor consumer group lag; alert at 60 seconds of lag. Scale index workers horizontally (more consumer partitions). The post-created event stays in Kafka for 7 days; no posts are permanently lost from the index.

**Shard failure**: one of 20 Elasticsearch shards goes down. Queries fan out to 19 shards. Results are incomplete for documents on the failed shard. Elasticsearch replicas (each shard has one replica on a different node) provide automatic failover within 30 seconds. Surface the shard health status in API responses so clients know results may be incomplete.

**Privacy filter false negatives**: a bug causes the privacy filter to include a friends-only post in a public user's results. This is the most serious failure mode, a privacy violation. Mitigate with a defense-in-depth approach: filter at query time (current design) plus add a visibility field to the Elasticsearch document and pre-filter at the index level (`"filter": {"term": {"visibility": "public"}}`).

**Redis typeahead cache eviction**: under memory pressure, Redis evicts typeahead cache entries. Users see slow typeahead responses (cache miss path hits Elasticsearch). The impact is latency, not correctness. Set a dedicated Redis instance for typeahead with a memory limit and LRU eviction, separate from the query result cache.

## Key takeaways

**The inverted index is the data structure; everything else is infrastructure.** Posting lists, BM25 ranking, and delta encoding are the core. The Kafka pipeline, Elasticsearch sharding, and Redis caching are the scaffolding that makes the core work at scale.

**Shard-by-document with fan-out is the right choice for social search.** Shard-by-term creates hot shards for common words ("the", "I", "my"). Shard-by-document distributes load evenly. The cost is fan-out on every query, which is manageable with parallel async requests.

**Privacy filtering belongs on the query path, not in the index.** Pre-computing per-user indexes for 3 billion users is not feasible for public content. Post-query filtering on the top-100 candidates adds 15ms and keeps the index simple and uniform.

**Typeahead is a Redis prefix cache problem.** The 10,000 hottest prefixes cover the vast majority of traffic. Cache them proactively. The cold tail of rare prefixes is handled by the Elasticsearch fallback path.

**The indexing pipeline is structurally identical to the URL Shortener analytics pipeline.** Event published to Kafka, consumer updates a store. Once you recognize this pattern it applies everywhere: search index updates, recommendation model feature pipelines, audit log writers. Design for it explicitly.

## References

- [Elasticsearch: Relevance and Scoring with BM25](https://www.elastic.co/guide/en/elasticsearch/reference/current/similarity.html)
- [Facebook Engineering: Social Graph Search](https://engineering.fb.com/2013/01/15/core-infra/under-the-hood-building-graph-search-beta/)
- [Introduction to Information Retrieval (Manning, Raghavan, Schutze)](https://nlp.stanford.edu/IR-book/)
- [System Design Interview Vol 2, Alex Xu, Chapter 11](https://bytebytego.com/)

## Related topics

- [Case Study: URL Shortener](./url-shortener/), Kafka indexing pipeline pattern
- [Case Study: Ad Click Aggregator](./ad-click-aggregator/), Kafka fan-out pipeline at billing scale
- [Case Study: Facebook News Feed](./facebook-news-feed/), social affinity signals and Redis sorted sets
- [Databases](../databases/), Elasticsearch as a document store and inverted index engine
- [Caching](../caching/), Redis for query result cache and typeahead prefix cache
- [Consistent Hashing](../consistent-hashing/), Elasticsearch shard routing
- [Message Queues](../message-queues/), Kafka for the post-created event stream
