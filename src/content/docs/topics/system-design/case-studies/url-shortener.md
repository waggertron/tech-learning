---
title: "Case Study: URL Shortener"
description: "Full system design walkthrough for a TinyURL-style URL shortener: ID generation strategies, redirect caching, analytics pipeline, and the subtle choices that separate good from great answers."
parent: case-studies
tags: [system-design, case-studies, interviews]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

The URL shortener is the "hello world" of system design interviews. It appears in virtually every company's interview loop as a warm-up or a standalone problem. Its simplicity is deceptive: the interesting parts are ID generation (how to produce 7 characters that are globally unique at high QPS without a bottleneck), redirect semantics (301 vs 302 and the analytics implications), and the analytics pipeline. Candidates who nail all three stand out significantly.

## Clarifying questions

Ask these before drawing anything:

- **Scale**: how many URLs created per day? How many redirects per day?
- **URL lifetime**: do URLs expire? If so, when?
- **Custom aliases**: can users specify a custom short code (e.g. `short.ly/my-campaign`)?
- **Analytics**: do we need click tracking (count, geo, device, referrer)?
- **Authentication**: can anonymous users create URLs, or is an account required?

What the answers reveal:
- 100M creates/day vs 1M/day changes the ID space and sharding decision
- No expiration means storage grows indefinitely -- plan for tiered storage
- Custom aliases require a separate uniqueness check and reservation system
- Analytics drives a separate write path (cannot be synchronous with redirect)

For this walkthrough: 100M URLs/day, 10:1 read/write ratio, no expiration, optional analytics, no auth required.

## Estimation

```
Write QPS:
  100M / 86,400 = 1,157 writes/sec
  Peak (3x): ~3,500 writes/sec

Read QPS (redirects):
  1B / 86,400 = 11,574 reads/sec
  Peak (3x): ~34,700 reads/sec

Storage (5-year retention):
  100M/day * 365 * 5 = 182.5B URLs
  Per record: short_code(8) + long_url(avg 100B) + metadata(~100B) = ~210 bytes
  182.5B * 210 bytes = ~38 TB

Bandwidth:
  Read: 34,700 * 100 bytes = 3.5 MB/s (trivial)
  Write: 3,500 * 210 bytes = 0.7 MB/s (trivial)
```

**Conclusion**: storage (38 TB) is the constraint, not CPU or bandwidth. A single database node cannot hold 38 TB efficiently -- this system needs sharding or a distributed KV store.

## High-level design

```
Client
  |
  +--[POST /shorten]--> API Gateway --> URL Service --> ID Generator
  |                                         |               |
  |                                         v               v
  |                                    Database         short_code
  |                                     (write)
  |
  +--[GET /{code}]---> Cache (Redis)
                           |  (miss)
                           v
                        Database (read)
                           |
                           v
                      302 Redirect
                           |
                    Analytics Event --> Kafka --> Analytics Service
```

Two endpoints:

```
POST /shorten
  body:    { long_url: string, custom_alias?: string, expires_at?: timestamp }
  returns: { short_url: string, short_code: string, created_at: timestamp }

GET /{short_code}
  returns: 302 redirect to long_url
           (or 404 if code not found, 410 if expired)
```

## Deep dive: ID generation

This is the most interesting part of the problem. You need to generate a short code (7 characters) that is:
- Globally unique across all servers
- Not guessable (security: users should not be able to enumerate other short URLs)
- Generated without a round-trip to the database on every write

**Option 1: Auto-increment + base62 encoding**

Use a database auto-increment integer, then encode it in base62 (characters 0-9, a-z, A-Z).

```python
import string

CHARS = string.digits + string.ascii_lowercase + string.ascii_uppercase  # 62 chars

def encode_base62(n: int) -> str:
    if n == 0:
        return CHARS[0]
    result = []
    while n:
        result.append(CHARS[n % 62])
        n //= 62
    return ''.join(reversed(result))

# 62^7 = 3.5 trillion possible codes -- more than enough
print(encode_base62(1))         # '1'
print(encode_base62(100_000))   # 'q0U'
print(encode_base62(1_000_000)) # '4c92'
```

**Problem**: the database auto-increment becomes a bottleneck at 3,500 writes/sec. Every write must hit the primary DB to get the next ID.

**Option 2: Dedicated ID service (Snowflake-style)**

A separate ID service generates unique IDs without database involvement. Each ID embeds a timestamp, machine ID, and sequence number:

```
[ 41 bits: millisecond timestamp ] [ 10 bits: machine ID ] [ 12 bits: sequence ]
= 63-bit integer, ~4096 IDs/ms per machine, unique across 1024 machines
```

App servers request IDs from the ID service in bulk (fetch 10,000 at a time), then serve from local memory. This removes the ID bottleneck entirely.

**Option 3: Hash the long URL**

`short_code = base62(MD5(long_url))[:7]`

Deterministic: the same long URL always produces the same short code (built-in deduplication).

**Problem**: MD5 collisions. Two different URLs can produce the same 7-character prefix. Must detect collisions and handle them (append a counter, rehash). Collision probability with 7 chars from MD5 is low (~1 in 3.5T) but non-zero and grows as the database fills.

**Recommendation**: use the Snowflake-style ID service. It removes the single-point bottleneck, produces globally unique IDs, and is simple to reason about. Custom aliases bypass the ID service and are stored directly.

## Deep dive: redirect semantics (301 vs 302)

This is a detail most candidates miss. When redirecting `short.ly/abc` to the original URL:

**301 Moved Permanently**: the browser caches the redirect. Future requests to `short.ly/abc` never hit your server -- the browser redirects locally. 

- Pro: saves server load
- Con: analytics become inaccurate (subsequent clicks are never counted because they go directly to the destination)

**302 Found (temporary redirect)**: the browser does not cache. Every click goes through your server.

- Pro: every click is counted -- analytics are accurate
- Con: higher server load (every repeat visit hits your servers)

**Decision**: if analytics matter, use 302. If minimizing server load is the priority and analytics are not needed, use 301. In most interview scenarios where analytics are mentioned, the answer is 302.

## Deep dive: caching redirects

Redirects are the dominant read load (34,700 QPS peak). The cache strategy:

- Key: `short_code`
- Value: `long_url`
- TTL: no expiration if URLs are permanent; set TTL = URL expiration time if URLs expire
- Eviction: LRU (most short codes are accessed rarely; a small fraction drives most traffic)

Cache hit rate will be very high due to the Zipf distribution of link access: roughly 1% of URLs generate 80% of redirects. A Redis cluster with 10 GB of RAM can hold ~50M URL mappings, covering the hot 1% of 5B URLs.

```python
import redis
import json

r = redis.Redis(host='cache-cluster', port=6379)

def redirect(short_code: str) -> str | None:
    # 1. Check cache
    cached = r.get(f"url:{short_code}")
    if cached:
        return cached.decode()

    # 2. Miss: fetch from DB
    record = db.query_one("SELECT long_url, expires_at FROM urls WHERE short_code = %s", short_code)
    if not record:
        return None

    # 3. Populate cache (don't cache expired URLs)
    if not record['expires_at'] or record['expires_at'] > now():
        r.setex(f"url:{short_code}", 3600, record['long_url'])

    return record['long_url']
```

## Deep dive: analytics pipeline

Never write analytics synchronously in the redirect path. Adding a DB write to every redirect doubles latency and halves throughput.

Instead, publish an event to Kafka on each redirect:

```
Redirect request arrives
  |
  +---> Return 302 immediately (fast path)
  |
  +---> Publish event to Kafka (async, non-blocking):
          { short_code, timestamp, user_agent, ip, referrer }
                |
                v
           Analytics Consumer (Kafka consumer)
                |
                v
           ClickHouse / Druid (column store for aggregation)
                |
                v
           Analytics API: GET /analytics/{short_code}
           Returns: { total_clicks, by_day, by_country, by_device }
```

The redirect path stays at <10ms. The analytics pipeline has seconds of latency but that is fine -- nobody needs real-time click analytics to the millisecond.

## Failure modes

**ID service outage**: short URL creation fails. App servers have pre-fetched ID ranges locally, so they can continue creating URLs for their remaining local range (typically thousands of IDs). After exhaustion, they fail gracefully with a 503.

**Cache cluster failure**: redirects fall through to the database. Read load increases dramatically. The database must handle peak read QPS without cache. Mitigate with connection pooling (PgBouncer) and read replicas. This is why having multiple DB read replicas matters.

**Database full**: 38 TB over 5 years is manageable, but plan a storage lifecycle. Move URLs with no clicks in 90+ days to cold storage (Glacier). Only warm storage needs to be in the fast path.

**URL expiration race condition**: a URL expires at exactly the same time two requests arrive. One reads the URL from cache (still valid), one gets a 410 from the database. Use the cache TTL to equal the expiration time, so the cache entry and the DB record expire together.

## Key takeaways

**The ID generation choice is the interview's real question.** Interviewers asking about URL shorteners are often testing whether you know the tradeoffs between database auto-increment (simple but creates a hotspot), UUID (no hotspot but wastes space and is unordered), and distributed ID generation (complex but scales). Know all three options and why the Snowflake-style service wins at high QPS.

**301 vs 302 is a signal question.** It is an easy detail to mention and almost always missed. Bringing it up unprompted signals that you have thought about analytics, not just the happy path.

**Compute the storage before designing the DB.** 38 TB rules out a naive single-node Postgres setup. The number forces a conversation about sharding, distributed KV stores, or lifecycle policies. Let the numbers drive the decision.

**The analytics pipeline is a fanout problem.** Every redirect fans out to an analytics write. Keeping this off the critical path (via Kafka) is the canonical pattern that reappears in notifications, audit logs, and activity feeds.

**Custom aliases need a reservation system.** If you allow custom aliases, you need an atomic "check-and-reserve" operation to prevent two users from claiming the same alias simultaneously. `INSERT ... ON CONFLICT DO NOTHING` or a Redis `SET NX` before the DB write handles this.

## References

- [System Design Interview Vol 1, Alex Xu, Chapter 8](https://bytebytego.com/)
- [Twitter Snowflake ID generation](https://blog.twitter.com/engineering/en_us/a/2010/announcing-snowflake)
- [BASE62 encoding for URL shorteners](https://en.wikipedia.org/wiki/Base62)

## Related topics

- [Interview Framework](../interview-framework/), the 4-step approach used in this walkthrough
- [Back-of-Envelope Estimation](../estimation/), how to derive the numbers in the estimation section
- [Caching](../../caching/), redirect caching strategy
- [Consistent Hashing](../../consistent-hashing/), one approach to sharding the URL store
