---
title: Caching
description: "Cache strategies, eviction policies, CDN edge caching, cache invalidation, and the trade-offs that determine which approach fits your read pattern and consistency requirements."
parent: system-design
tags: [system-design, caching, redis, performance]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

A cache stores the result of an expensive operation so the next request can get it cheaply. The expense may be a database query, a remote API call, a computation, or even a DNS lookup. Caching is the single highest-leverage performance optimization in most web systems because it reduces latency by orders of magnitude.

## Why caching works: the latency cliff

```
L1 cache:       1 ns
L2 cache:       4 ns
RAM:          100 ns
SSD:          150 us   (150,000 ns  -- 1500x slower than RAM)
HDD:           10 ms   (10,000 us   -- 1000x slower than SSD)
Network (LAN): 500 us
Network (WAN): 150 ms
```

A database query that hits disk costs 10-150 ms. Serving the same result from Redis costs 100-500 us. For a page that makes 20 database calls, caching turns a 2+ second response into a 10 ms response.

## Cache placement

Caches can sit at many layers:

```
Client -> [ CDN / Edge Cache ]
             |
             v
          [ Reverse Proxy Cache (Nginx) ]
             |
             v
          [ Application Cache (Redis / Memcached) ]
             |
             v
          [ Database Buffer Pool ]
             |
             v
          [ Disk ]
```

Each layer catches what the one above it misses. The goal is to satisfy as many requests as possible at the fastest layer.

## Cache strategies

### Cache-aside (lazy loading)

The application manages the cache manually. On a read:
1. Check the cache. If hit, return the cached value.
2. If miss, read from the database.
3. Write the result into the cache, then return it.

```python
import redis
import json

r = redis.Redis()

def get_user(user_id: int) -> dict:
    cache_key = f"user:{user_id}"

    # 1. Check cache
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)

    # 2. Cache miss: read from DB
    user = db.query("SELECT * FROM users WHERE id = %s", user_id)

    # 3. Populate cache with TTL
    r.setex(cache_key, 300, json.dumps(user))  # expires in 5 minutes
    return user
```

**Pros**: only requested data is cached (no cold-loading of unused data). Cache failures degrade gracefully (fall through to DB).

**Cons**: first request after cache miss is slow. Cache can hold stale data until TTL expires or explicit invalidation.

### Read-through

The cache itself fetches from the database on a miss. The application always talks to the cache only. The cache populates itself automatically.

**Pros**: application code is simpler. Consistent read path.

**Cons**: cache must know how to query the database. First-time reads are still slow.

### Write-through

Every write goes to the cache and the database simultaneously. The cache is always up to date.

```
Write "user:42 = {...}" to:
  1. Redis (immediately)
  2. Database (immediately)
```

**Pros**: no stale reads. Cache always consistent with DB.

**Cons**: every write is slower (two writes per operation). Cache fills with data that may never be read.

### Write-behind (write-back)

Write to the cache immediately, write to the database asynchronously in the background.

**Pros**: very fast writes. Database is shielded from write spikes.

**Cons**: data loss if the cache crashes before flushing to the database. More complex to implement correctly.

## Eviction policies

When a cache is full, something must be evicted. The policy determines what gets removed:

| Policy | Description | Best for |
| --- | --- | --- |
| LRU (Least Recently Used) | Evict the item not accessed for the longest time | General purpose; works well when recent access predicts future access |
| LFU (Least Frequently Used) | Evict the item accessed the fewest times | Data with clear popularity tiers (hot/cold) |
| FIFO | Evict the oldest-inserted item | Simple, rarely optimal |
| TTL | Evict after a fixed time-to-live | Data with a known expiration (sessions, rate limit counters) |
| Random | Evict a random item | Surprisingly competitive with LRU in practice |

Redis supports LRU, LFU, TTL, and volatile variants (only evict keys that have a TTL set).

### LRU cache implementation

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()  # insertion order = LRU order

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)  # mark as most recently used
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)  # evict least recently used

cache = LRUCache(3)
cache.put(1, "a")
cache.put(2, "b")
cache.put(3, "c")
cache.get(1)       # access key 1 (moves to end)
cache.put(4, "d")  # evicts key 2 (least recently used)
print(list(cache.cache.keys()))  # [3, 1, 4]
```

## CDN: caching at the edge

A Content Delivery Network is a globally distributed network of cache servers (edge nodes). When a user in Tokyo requests an image, it serves from a Tokyo edge node instead of your origin server in Virginia.

CDNs cache:
- Static assets: images, JS, CSS, fonts
- API responses (with appropriate cache headers)
- Entire HTML pages for fully static sites

Cache control is via HTTP headers:

```
Cache-Control: public, max-age=86400        # cache for 1 day
Cache-Control: private, no-store            # never cache
Surrogate-Control: max-age=3600             # CDN-specific TTL
ETag: "abc123"                              # content fingerprint for conditional requests
```

When content changes, you bust the cache by changing the URL (e.g. `style.v2.css`) or by sending an API call to the CDN to invalidate specific paths.

## Cache invalidation

Cache invalidation is famously hard. Phil Karlton: "There are only two hard things in computer science: cache invalidation and naming things."

**TTL-based**: let the cache expire naturally. Simple, but data is stale for up to TTL seconds after an update. Acceptable for data that can tolerate brief staleness (product catalog, user profile).

**Event-driven invalidation**: when a write happens, explicitly delete or update the cache entry.

```python
def update_user(user_id: int, data: dict) -> None:
    db.execute("UPDATE users SET ... WHERE id = %s", user_id)
    r.delete(f"user:{user_id}")  # invalidate immediately
```

**Write-through**: always write cache and DB together (no stale window).

**Cache stampede** (thundering herd): when a popular cache entry expires, many requests miss simultaneously and all hammer the database. Mitigations:
- Use a lock: only one process fetches from DB; others wait.
- Probabilistic early expiration: re-compute before TTL expires, slightly randomly.
- Background refresh: a background job refreshes the cache before it expires.

```python
import time
import threading

_lock = threading.Lock()
_cache = {}

def get_with_stampede_protection(key, fetch_fn, ttl=300):
    entry = _cache.get(key)
    if entry and entry['expires'] > time.time():
        return entry['value']

    with _lock:
        # Re-check after acquiring lock (another thread may have refreshed)
        entry = _cache.get(key)
        if entry and entry['expires'] > time.time():
            return entry['value']

        value = fetch_fn()
        _cache[key] = {'value': value, 'expires': time.time() + ttl}
        return value
```

## When not to cache

- **Highly dynamic data**: if every request requires fresh data (stock prices, live scores), caching adds complexity without benefit.
- **User-specific data at high cardinality**: caching every user's personalized feed wastes memory if each entry is only accessed once.
- **Write-heavy paths**: caching a value you immediately overwrite provides no hit rate benefit.
- **Small datasets**: if the entire dataset fits in database memory (buffer pool), the DB is already serving from RAM. A separate cache layer just adds a network hop.

## References

- [Redis documentation: eviction policies](https://redis.io/docs/reference/eviction/)
- [Cloudflare CDN Cache docs](https://developers.cloudflare.com/cache/)
- [AWS ElastiCache best practices](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/BestPractices.html)
- [Caching strategies, AWS Architecture Blog](https://aws.amazon.com/caching/best-practices/)

## Related topics

- [Scalability](../scalability/), caching is the primary tool for absorbing read load before scaling databases
- [Databases at Scale](../databases/), understanding database buffer pools and why they act as an implicit cache
- [CAP Theorem](../cap-theorem/), cache-aside with eventual consistency is an AP trade-off
- [Rate Limiting](../rate-limiting/), rate limit counters are almost always stored in a cache (Redis)
- [Consistent Hashing](../consistent-hashing/), distributed caches use consistent hashing to decide which node holds which key
