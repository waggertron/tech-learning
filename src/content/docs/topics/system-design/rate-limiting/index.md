---
title: Rate Limiting
description: "Token bucket, leaky bucket, fixed window, sliding window: the four algorithms, where in the stack to enforce them, what to send back to clients, and the pitfalls that make a working rate limiter let abuse through."
parent: system-design
tags: [system-design, rate-limiting, api, security]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

Rate limiting controls how many requests a client can make in a given time window. It protects services from abuse, prevents runaway clients from degrading shared resources, and enforces fair usage in multi-tenant systems.

## Why rate limiting matters

Without rate limiting, a single misbehaving client can exhaust your database connections, saturate CPU, or generate unbounded costs in a usage-billed system. Rate limiting is a basic defensive layer.

Three reasons to rate limit:

1. **Abuse prevention**: block bots, scrapers, and credential-stuffing attacks.
2. **Fair sharing**: prevent one tenant from starving others in a shared system.
3. **Cost control**: prevent runaway clients from generating large API bills (your own or third-party).

## The four algorithms

### Token bucket

A bucket holds up to `capacity` tokens. Tokens refill at a fixed rate (R tokens per second). Each request consumes one token. If the bucket is empty, the request is rejected.

```
capacity = 10, refill_rate = 2 tokens/sec

t=0:   bucket=[10 tokens]  -> request consumes 1 -> [9 tokens]
t=0:   burst of 9 more requests -> [0 tokens]
t=0:   next request -> REJECTED (429)
t=0.5: refilled 1 token -> [1 token]
t=1:   refilled 2 more -> [2 tokens]
```

**Properties**: allows bursting up to `capacity`. Smooths traffic to `R` requests/sec in steady state. Most commonly used algorithm.

```python
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate  # tokens per second
        self.last_refill = time.monotonic()

    def _refill(self):
        now = time.monotonic()
        elapsed = now - self.last_refill
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill = now

    def consume(self, tokens: int = 1) -> bool:
        self._refill()
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True  # allowed
        return False  # rejected

bucket = TokenBucket(capacity=10, refill_rate=2)
for i in range(15):
    allowed = bucket.consume()
    print(f"Request {i+1}: {'OK' if allowed else 'REJECTED'}")
    time.sleep(0.1)
```

### Leaky bucket

Requests enter a FIFO queue (the "bucket"). The queue drains at a fixed rate. If the queue is full, new requests are dropped. Requests are processed at a constant rate regardless of arrival pattern.

**Properties**: produces perfectly smooth output. No bursting. A flood of requests does not cause a flood of processing; excess requests are queued or dropped.

**Best for**: rate-limiting outgoing requests to a downstream API that enforces a strict per-second limit.

### Fixed window counter

Count requests in fixed time windows (e.g. 0-60s, 60-120s). If the count exceeds the limit, reject.

```
Window [0s, 60s]:   count=98, limit=100
t=59s: 2 more requests -> count=100, OK
t=60s: new window, count=0
t=60s: 100 more requests in the first second of the new window -> all allowed
```

**Boundary problem**: a client can send 100 requests at t=59s and 100 more at t=60s, getting 200 requests through in 2 seconds while nominally limited to 100 per minute.

### Sliding window log

Store a timestamp for each request in a sorted set. On each request, remove timestamps older than the window, count what remains, and reject if over the limit.

**Properties**: accurate. No boundary problem.

**Cost**: O(requests per window) memory per client. For a limit of 1000 req/min with many clients, the memory adds up.

### Sliding window counter (hybrid)

Maintain two fixed window counters: the previous window and the current window. Estimate the count in the sliding window as:

```
estimated = current_count + prev_count * (window_size - elapsed) / window_size
```

**Properties**: O(1) memory per client, good approximation of the sliding window (usually within 1% of accurate).

This is the algorithm Redis uses internally in its rate limiter cell modules, and it is the best general-purpose choice.

## Distributed rate limiting

A single-server rate limiter is straightforward. When you have many API servers behind a load balancer, each server has a local view of request counts. A client can bypass a per-server limit by spreading requests across servers.

Solution: store rate limit counters in a shared cache (Redis). Every API server increments and reads from the same Redis counter.

```python
import redis
import time

r = redis.Redis()

def is_allowed(client_id: str, limit: int, window_seconds: int) -> bool:
    key = f"rate:{client_id}:{int(time.time()) // window_seconds}"
    pipe = r.pipeline()
    pipe.incr(key)
    pipe.expire(key, window_seconds * 2)
    count, _ = pipe.execute()
    return count <= limit

# Fixed window, Redis-backed
print(is_allowed("user:42", limit=100, window_seconds=60))
```

Redis operations are atomic (INCR is atomic), so no race conditions between API servers.

## Where to enforce

Rate limiting can sit at multiple layers:

```
[ Client ]
    |
[ CDN / Edge ]       <- block obvious bots before they reach your infrastructure
    |
[ API Gateway ]      <- primary enforcement layer; per-key, per-route limits
    |
[ Application ]      <- fine-grained business limits (e.g. 5 password resets/hour)
    |
[ Database ]         <- connection pooling acts as implicit rate limiting on DB
```

**API gateway** is the canonical enforcement point. It handles authentication, extracts the client identity (API key, user ID, IP), and enforces limits before the request reaches your application code.

**Application layer** for limits that depend on business logic (e.g. "a user can invite at most 10 people per day" requires knowing the user's invite count, not just request count).

## Response: 429 Too Many Requests

When a request is rejected, return HTTP 429 with useful headers:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 42
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1715040060

{
  "error": "rate_limit_exceeded",
  "message": "You have exceeded 100 requests per minute. Retry after 42 seconds."
}
```

`Retry-After` is the most important header: it tells the client exactly when to retry. Without it, clients either retry immediately (wasting your resources) or implement arbitrary backoff (wasting their time).

## Pitfalls

**Rate limiting on IP only**: shared IPs (NAT, corporate proxies) can rate-limit thousands of legitimate users. Use a more precise identifier (API key, authenticated user ID) as the primary dimension, with IP as a secondary signal.

**Not handling clock skew**: distributed systems have slightly different clocks. A fixed window that resets exactly at minute boundaries may reset at slightly different times on different servers. Sliding window or Redis-based centralized counters avoid this.

**No burst allowance**: a limit of exactly 1 req/sec with no burst capability breaks clients that make two legitimate requests close together. Token bucket with a burst capacity of 5-10 is more practical.

**Forgetting internal traffic**: rate limiting is for external clients. Internal services making server-to-server calls should not be rate-limited by the same limits as public API consumers.

## References

- [System Design Interview, Alex Xu, Chapter 4](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
- [IETF RFC 6585: 429 Too Many Requests](https://datatracker.ietf.org/doc/html/rfc6585)
- [Redis rate limiting patterns](https://redis.io/glossary/rate-limiting/)
- [Cloudflare rate limiting docs](https://developers.cloudflare.com/waf/rate-limiting-rules/)

## Related topics

- [API Design](../api-design/), 429 status code and Retry-After header semantics
- [Load Balancing](../load-balancing/), rate limiting is often co-located with the load balancer or API gateway
- [Caching](../caching/), rate limit counters are stored in Redis (a cache)
- [Scalability](../scalability/), rate limiting protects shared resources from overload
