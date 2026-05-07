---
title: Load Balancing
description: "How load balancers distribute traffic across server pools: algorithms, L4 vs L7, health checks, sticky sessions, and where load balancers sit in a real system."
parent: system-design
tags: [system-design, load-balancing, networking]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

A load balancer sits in front of a pool of servers and routes each incoming request to one of them. Without one, you cannot add servers without also telling clients about each new address. With one, clients talk to a single stable address and the load balancer handles distribution invisibly.

## What a load balancer does

```
Client
  |
  v
[ Load Balancer ]
  |         |         |
  v         v         v
[Server 1] [Server 2] [Server 3]
```

Three things load balancers do beyond routing:

1. **Health checking**: remove servers that fail checks from the pool automatically. Requests stop going to a dead server within seconds.
2. **SSL termination**: decrypt HTTPS at the load balancer so backend servers only handle plaintext HTTP. Reduces CPU overhead on each server and centralizes certificate management.
3. **Connection pooling**: maintain persistent connections to backends and reuse them, reducing TCP handshake overhead.

## Load balancing algorithms

### Round robin

Send request 1 to server A, request 2 to server B, request 3 to server C, then repeat. Simple and equal if all requests are similar in cost.

```
Request 1 -> Server A
Request 2 -> Server B
Request 3 -> Server C
Request 4 -> Server A  (wraps)
```

**Problem**: if requests vary wildly in cost, a slow request on server A blocks future requests assigned to it while servers B and C sit idle.

### Weighted round robin

Same as round robin but each server has a weight. A server with weight 3 gets three requests for every one that a weight-1 server gets. Useful when servers have different capacities.

### Least connections

Route each new request to the server with the fewest active connections. Better than round robin when request durations vary significantly.

```python
def least_connections(servers):
    return min(servers, key=lambda s: s.active_connections)
```

### IP hash (sticky routing)

Hash the client IP address to consistently route the same client to the same server. Used for stateful applications that cannot externalize session state.

```python
def ip_hash(client_ip, servers):
    index = hash(client_ip) % len(servers)
    return servers[index]
```

**Problem**: when a server is added or removed, the hash changes and existing sessions are disrupted. Use consistent hashing to solve this.

### Random with two choices (power of two choices)

Pick two servers at random, send to the one with fewer active connections. Approaches the performance of least connections with much lower bookkeeping overhead. Used in large-scale load balancers.

## L4 vs L7 load balancing

**Layer 4 (transport layer)**: operates on TCP/UDP. Sees IP addresses and ports, not the request content. Fast; makes routing decisions in microseconds. Cannot route based on URL path, cookies, or headers.

**Layer 7 (application layer)**: operates on HTTP/HTTPS. Can inspect headers, cookies, URL paths, and request bodies. Enables content-based routing (route `/api/` to the API pool, `/static/` to the CDN origin). Slower than L4 because it must parse the full HTTP request.

| | L4 | L7 |
| --- | --- | --- |
| Routing basis | IP + port | URL, headers, cookies |
| TLS termination | No (passes through) | Yes |
| Speed | Faster | Slower |
| Examples | AWS NLB, HAProxy TCP mode | AWS ALB, Nginx, Envoy |

In practice, most web systems use L7 for external traffic (to route by path and terminate TLS) and L4 for internal service-to-service traffic where speed matters more than routing flexibility.

## Health checks

A health check is a probe the load balancer sends to each backend to verify it can serve requests. Two types:

**Active (proactive)**: the load balancer periodically sends a request (usually HTTP GET `/health`) and removes the server if it does not respond with a 200 within a timeout.

**Passive (reactive)**: the load balancer monitors real request failures. After N consecutive failures, it removes the server from the pool.

```
Healthy server: responds to GET /health within 1s
         |
         v
Probe fails for 3 consecutive checks
         |
         v
Server removed from pool. Requests redistributed to remaining servers.
         |
         v
Server recovers, passes 2 consecutive checks
         |
         v
Server re-added to pool.
```

A good `/health` endpoint checks not just "am I alive" but "can I serve requests": database connection is up, cache is reachable, any required dependencies are reachable.

## Sticky sessions

Some applications store state locally (in-process session, local file uploads) and need requests from the same client to land on the same server. This is called sticky sessions or session affinity.

The load balancer does this by setting a cookie (e.g. `SERVERID=server-2`) and routing all requests bearing that cookie to the named server.

**Downsides of sticky sessions:**
- Uneven load distribution (some sessions are more expensive than others)
- If the sticky server fails, the session is lost (unless replicated elsewhere)
- Makes deployments harder (draining a server means waiting for all sticky sessions to expire)

Prefer stateless design (externalize session to Redis) over sticky sessions whenever possible.

## DNS load balancing

DNS can return multiple A records for a hostname. Clients pick one (usually the first in the list). DNS TTL controls how often clients re-resolve, which controls how quickly changes propagate.

**GeoDNS**: return different IP addresses based on the requesting client's geography. Route European users to European servers, US users to US servers. This is how global CDNs and large-scale systems achieve geographic routing cheaply.

**Limitations**: DNS caching means changes are slow to propagate. DNS cannot check server health. Round-robin DNS distributes connections but not load (a client that caches a DNS result and makes 1000 requests is heavier than a client that makes 1 request).

## Real-world topology

A typical web system has multiple layers of load balancing:

```
Internet
  |
[ DNS / GeoDNS ]
  |
[ Edge / CDN ]  <-- serves static assets, terminates TLS
  |
[ L7 Load Balancer (ALB / Nginx) ]  <-- routes by path, handles auth headers
  |              |
[ API Pool ]  [ Static Origin Pool ]
  |
[ Internal L4 LB ]
  |         |
[ Service A ] [ Service B ]
  |
[ Database Pool (read replicas via RDS Proxy) ]
```

## Code: round-robin load balancer

```python
from itertools import cycle
from dataclasses import dataclass, field
from typing import List

@dataclass
class Server:
    address: str
    healthy: bool = True

class RoundRobinBalancer:
    def __init__(self, servers: List[Server]):
        self._all = servers
        self._cycle = cycle(servers)

    def next_server(self) -> Server | None:
        # Try up to len(servers) times to find a healthy one
        for _ in range(len(self._all)):
            server = next(self._cycle)
            if server.healthy:
                return server
        return None  # all servers down

balancer = RoundRobinBalancer([
    Server("10.0.0.1:8080"),
    Server("10.0.0.2:8080"),
    Server("10.0.0.3:8080"),
])

for i in range(6):
    s = balancer.next_server()
    print(f"Request {i+1} -> {s.address}")
# Request 1 -> 10.0.0.1:8080
# Request 2 -> 10.0.0.2:8080
# Request 3 -> 10.0.0.3:8080
# Request 4 -> 10.0.0.1:8080
# ...
```

## References

- [NGINX Load Balancing docs](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)
- [AWS Elastic Load Balancing product comparison](https://aws.amazon.com/elasticloadbalancing/features/)
- [HAProxy documentation](https://www.haproxy.org/download/2.8/doc/architecture.txt)
- [The Power of Two Random Choices, Mitzenmacher](https://www.eecs.harvard.edu/~michaelm/postscripts/handbook2001.pdf)

## Related topics

- [Scalability](../scalability/), horizontal scaling is the prerequisite for needing a load balancer
- [Caching](../caching/), CDN edge nodes are a specialized form of load-balanced cache
- [Consistent Hashing](../consistent-hashing/), the better alternative to IP hash when servers are added or removed
- [Rate Limiting](../rate-limiting/), often implemented at the load balancer or API gateway layer
