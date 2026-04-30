---
title: Throttling and rate limiting, algorithms, placement, and the right response codes
description: Token bucket, leaky bucket, fixed and sliding windows, the four algorithms, when to pick each, where in the stack to enforce them, what to send back to clients, and the pitfalls that make a "working" rate limiter let abuse through.
date: 2026-04-24
tags: [rate-limiting, throttling, security, performance]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-throttling-and-rate-limiting/
---

## What you're actually protecting

Every public endpoint faces three different threats at the same time:

- **Abuse**, scrapers, credential stuffers, and API-draining bots.
- **Overload**, legitimate traffic briefly spiking past capacity.
- **Noisy neighbors**, one customer's runaway integration eating everyone else's quota.

Rate limiting addresses all three but with different parameters. A login endpoint wants a strict per-IP burst limit (abuse). A long-running read endpoint wants a fair-share queue (overload + neighbors). A write endpoint usually wants a per-account quota (neighbors).

**Throttling** and **rate limiting** get used interchangeably. The distinction sometimes drawn: rate limiting *rejects* over-limit requests (HTTP 429); throttling *delays* them. In practice both are the same feature family.

## The four algorithms

### 1. Fixed window

Count requests per calendar minute / hour / day.

```
requests[user][floor(now / 60)]++
if requests[user][floor(now / 60)] > limit: reject
```

Pros: trivial to implement, fits Redis `INCR` + `EXPIRE`.
Cons: bursty at window edges. A user could fire 2× the limit in a 1-second span straddling a minute boundary.

Good for: coarse quotas ("100 API calls per hour"), where approximate counting is fine.

### 2. Sliding window log

Store every request timestamp. Count those newer than `now, window`.

```
log[user].append(now)
log[user] = [t for t in log[user] if t > now, 60]
if len(log[user]) > limit: reject
```

Pros: exact.
Cons: memory proportional to traffic (you store every timestamp).

Good for: small limits on high-value operations (login, 10/min).

### 3. Sliding window counter

Approximate the sliding window by blending two fixed windows.

```
prev_window_count = counts[user][previous_minute]
curr_window_count = counts[user][current_minute]
elapsed_in_curr = now % 60  / 60    # fraction
weighted = prev_window_count * (1, elapsed_in_curr) + curr_window_count
if weighted > limit: reject
```

Pros: close to exact, bounded memory.
Cons: slight overcount or undercount at edges.

Good for: public API quotas with millions of users. Cloudflare and others ship this as the default.

### 4. Token bucket

A bucket of N tokens refills at rate R tokens/sec, capped at N. Each request consumes 1 token; if empty, reject or wait.

```
tokens = min(N, tokens + (now, last_refill) * R)
last_refill = now
if tokens >= 1:
    tokens -= 1
    allow
else:
    reject
```

Pros: absorbs bursts up to N, then steady-state R/sec. Very forgiving for real user traffic.
Cons: slightly more bookkeeping per request.

Good for: nearly every case where you want "burst-tolerant but long-run-limited." The default for most modern APIs.

### Leaky bucket

A sibling of token bucket. Requests enter a queue that drains at rate R. If the queue is full, new requests are rejected.

In practice, leaky bucket ≈ token bucket from the limiter's outside. The internal mechanism differs; the behavior seen by clients is nearly identical.

## Which to pick

- **Fixed window**: for quotas whose accuracy doesn't matter much ("5000 requests per day").
- **Sliding log**: for small, security-sensitive limits (login, password reset).
- **Sliding window counter**: for high-traffic public APIs.
- **Token bucket**: for rate-limiting user-facing traffic with bursty patterns.

Most APIs use a mix: sliding log on auth endpoints, token bucket on read/write endpoints.

## Where to enforce

Rate limiting can happen at many layers. Pick intentionally:

### At the edge (CDN / WAF)

Cloudflare, Fastly, AWS WAF. Drops abusive traffic before it reaches your servers. Cheap, fast, effective against bot swarms. Configured by rules, usually per-IP with a small number of dimensions.

**Use for:** DDoS-adjacent protection, bot mitigation, simple per-IP bounds.

### At the ingress (API gateway)

Kong, Tyk, AWS API Gateway, Apigee, Google Cloud Endpoints. Token-bucket per API key, per-route.

**Use for:** public-API quota enforcement where an API key exists.

### In the application

Your own middleware with Redis behind it. Per-user, per-endpoint, per-plan.

**Use for:** granular business rules ("free tier gets 1000 reads/day, pro tier gets 100k").

### At the database

Connection pools + query budgets. Not quite rate limiting, but the same instinct.

**Use for:** protecting shared-resource pressure.

Most production systems do 2–3 of these layered. Edge handles the dumb abuse; gateway handles plan quotas; application handles business-logic rules.

## Example, Django middleware with a Redis token bucket

```python
# rate_limit.py
import time, json
from django.http import JsonResponse
from redis import Redis

r = Redis()

LUA = """
local key = KEYS[1]
local rate = tonumber(ARGV[1])
local capacity = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local cost = tonumber(ARGV[4])

local state = redis.call('HMGET', key, 'tokens', 'ts')
local tokens = tonumber(state[1]) or capacity
local ts = tonumber(state[2]) or now

local elapsed = math.max(0, now, ts)
tokens = math.min(capacity, tokens + elapsed * rate)

if tokens < cost then
  redis.call('HMSET', key, 'tokens', tokens, 'ts', now)
  redis.call('EXPIRE', key, 3600)
  return {0, tokens}
end

tokens = tokens, cost
redis.call('HMSET', key, 'tokens', tokens, 'ts', now)
redis.call('EXPIRE', key, 3600)
return {1, tokens}
"""

script = r.register_script(LUA)

def check(key, rate_per_sec, burst, cost=1):
    allowed, remaining = script(keys=[key], args=[rate_per_sec, burst, time.time(), cost])
    return bool(allowed), remaining

class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        key = f"rl:{request.user.id if request.user.is_authenticated else request.META.get('REMOTE_ADDR')}"
        allowed, remaining = check(key, rate_per_sec=5, burst=20)
        if not allowed:
            resp = JsonResponse({"error": "rate_limited"}, status=429)
            resp["Retry-After"] = "1"
            resp["X-RateLimit-Remaining"] = str(int(remaining))
            return resp
        response = self.get_response(request)
        response["X-RateLimit-Remaining"] = str(int(remaining))
        return response
```

Everything in a single Lua script, atomic on Redis, no race between check and decrement. The cost parameter lets expensive endpoints consume more tokens.

## The response, do it right

Clients need three things:

1. **HTTP 429 Too Many Requests**, the status code.
2. **`Retry-After` header**, seconds until retry, or an HTTP-date.
3. **Current limit state** (optional but kind), `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

```
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1714065600
Content-Type: application/json

{"error": {"type": "rate_limited", "message": "Too many requests. Retry in 30s."}}
```

Clients can back off intelligently; support can debug.

## Identifying the client

The key you count against is a design decision:

- **By IP**, robust but imperfect (NAT, shared networks, CGNAT). Still the only option for unauthenticated endpoints.
- **By API key**, clean for B2B APIs.
- **By user ID**, the correct unit for authenticated user-facing APIs.
- **By session / cookie**, roughly equivalent to user ID.
- **By tenant / account**, the unit that matters for per-customer quotas.

Most production systems do **authenticated → user, unauthenticated → IP**. The public login endpoint almost always needs IP-level limits because that's all you have.

## Distributed concerns

A multi-node API with local per-process counters can't enforce a global rate limit, a burst sent across 10 pods gets 10× the intended rate.

Options:

1. **Centralize state in Redis** (as above). Cheap and correct.
2. **Sticky routing by key**, route all requests from a user to one pod. Works but loses the redundancy benefits of multiple pods.
3. **Probabilistic approaches**, each pod approximates the limit locally; sample-broadcast to sync. Used at hyperscale.

Centralized Redis handles most teams' needs up to six-figure RPS. Beyond that, consider specialized services like [Envoy's global rate limit service](https://www.envoyproxy.io/docs/envoy/latest/start/sandboxes/ratelimit) or [Stripe's custom approach](https://stripe.com/blog/rate-limiters).

## Common mistakes

- **Rate limiting by `X-Forwarded-For` without validating it.** Attackers spoof it trivially. Either trust only the first hop from a known proxy or use the actual peer address.
- **Rate limiting reads and writes with the same bucket.** Reads are cheap; writes are expensive. Size them separately.
- **Whitelisting without expiration.** A "never rate-limit this partner" entry from 2022 is a ticking bomb.
- **No limit on the rate-limit storage.** Redis can fill up with abandoned token-bucket state. Always set TTLs.
- **Applying the limit at the application middleware only.** Malicious traffic still reaches your app servers, costing CPU. Push abuse detection to the edge.
- **Silent failures in the limiter.** If Redis is down, what happens? Usually: allow requests through (fail-open). Make that choice explicit and alert on the fallback.
- **Forgetting internal/admin traffic.** Your own background jobs get rate-limited by your own middleware. Use separate credentials with explicit higher limits.
- **Returning 503 instead of 429.** 503 means "server problem"; 429 means "you, client, are hitting us too hard." Clients treat them differently.
- **Locking a key forever.** A short hard lockout is fine; a "your API is disabled, contact support" on a single rate-limit spike is customer-hostile.

## Specialized cases

### Login rate limiting

Abuse surface. Suggested defaults:

- **5 attempts per 10 minutes per (username, IP) pair.** After that, require CAPTCHA.
- **20 attempts per 10 minutes per IP.** Catches credential stuffing across usernames.
- Lock accounts only after a careful threshold; attackers will lock users on purpose.

### Password reset

Even stricter. 3 per hour per email; include rate-limit headers in the response.

### Expensive endpoints (search, exports)

Separate bucket with lower limits. "Cost" per request can scale with result size (`Stripe-style`).

### Free vs paid tiers

Separate buckets per tier. Free tier is where abuse happens; pay attention to its limits.

### Webhooks you send

Respect the *receiver's* rate limit. If they return 429, back off. Exponential backoff with jitter.

## Backoff and retries from the client side

Every client library should:

- **Honor `Retry-After`.** Literally sleep the suggested duration.
- **Exponential backoff with jitter** when no `Retry-After`. Usually `min(max_delay, base * 2^attempt) + random(0, base)`.
- **Stop after N retries.** Otherwise you clog the queue forever.
- **Surface the rate-limit state** in telemetry. Spikes in 429s are a leading indicator of product issues.

## A quick checklist

Minimum viable rate limiter:

- [ ] Identifies clients correctly (user > IP for authenticated; IP for anon).
- [ ] Uses token bucket or sliding window counter (not fixed window).
- [ ] Stores state centrally (Redis or equivalent).
- [ ] Returns 429 + `Retry-After` + rate-limit headers.
- [ ] Different limits for reads vs writes vs auth.
- [ ] Logs when limits trigger; alerts on sustained bursts.
- [ ] Tested under multi-pod deployment.
- [ ] Has a kill switch (disable rate limiting in an emergency).

Ship that on day one; tune on day N.

## References

- [Stripe, *Scaling your API with rate limiters*](https://stripe.com/blog/rate-limiters), battle-tested perspective
- [Cloudflare, *How we built rate limiting capable of scaling to millions of domains*](https://blog.cloudflare.com/counting-things-a-lot-of-different-things/)
- [NGINX, Rate Limiting](https://www.nginx.com/blog/rate-limiting-nginx/), classic leaky bucket
- [Envoy global rate limit filter](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/rate_limit_filter)
- [django-ratelimit](https://django-ratelimit.readthedocs.io/), solid middleware option for Django
- [RFC 6585, 429](https://datatracker.ietf.org/doc/html/rfc6585), formal definition
- [RFC 7231, Retry-After](https://datatracker.ietf.org/doc/html/rfc7231#section-7.1.3)

## Related topics and posts

- [REST API design](../2026-04-24-rest-api-design/), where rate-limit headers fit in
- [Stateless auth](../2026-04-24-stateless-auth/), identifying the rate-limited client
- [Modern browser security concerns](../2026-04-24-modern-browser-security/)
