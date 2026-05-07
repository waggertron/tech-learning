---
title: Scalability
description: "Vertical vs horizontal scaling, stateless service design, the scale cube, read vs write bottlenecks, and how to reason about where a system will break first."
parent: system-design
tags: [system-design, scalability, distributed-systems]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

Scalability is the ability of a system to handle more load by adding resources. The word sounds simple but hides real complexity: not every kind of load increases together, not every resource is easy to add, and adding resources often introduces new failure modes.

## Vertical vs horizontal scaling

**Vertical scaling** (scale up): replace a server with a bigger one. More CPU cores, more RAM, faster storage. Simple operationally, no code changes, but hits a hard ceiling (the largest available machine) and creates a single point of failure.

**Horizontal scaling** (scale out): add more servers and distribute load across them. No ceiling in theory, high availability through redundancy, but requires that your application can actually run on multiple machines simultaneously.

```
Vertical                        Horizontal

  [ Big Server ]          [ Server ] [ Server ] [ Server ]
  CPU: 64 cores            CPU: 8     CPU: 8     CPU: 8
  RAM: 512 GB              RAM: 32    RAM: 32    RAM: 32

  Simpler, hits a ceiling   Requires stateless design
```

Most large systems start vertical (it's simpler), then move to horizontal once they hit a ceiling or need redundancy.

## Stateless design is a prerequisite for horizontal scaling

If each server stores session state locally (in memory or on disk), you cannot route a request to any server; it must go to the same one that handled the previous request. This is called **sticky sessions** and it kills your ability to scale out freely.

The solution is to externalize all state:

- **Session data** goes into a shared cache (Redis, Memcached).
- **File uploads** go into object storage (S3, GCS).
- **Database state** goes into a shared database, not a local SQLite file.

A server that holds no local state can be added, removed, or replaced at any time without affecting running requests. This is the key property that makes auto-scaling possible.

```python
# Stateful: tied to one server
user_sessions = {}  # lives in this process only

def get_session(session_id):
    return user_sessions.get(session_id)

# Stateless: works on any server
import redis
r = redis.Redis(host='redis-cluster', port=6379)

def get_session(session_id):
    return r.get(f"session:{session_id}")
```

## The scale cube

The scale cube (from "The Art of Scalability" by Abbott and Fisher) breaks scaling into three axes:

```
Z: Data partitioning (shard by user ID, region, etc.)
|
|
+------------ Y: Functional decomposition (split monolith into services)
/
/
X: Horizontal duplication (run N copies of the same thing)
```

- **X axis**: run multiple identical copies behind a load balancer. Easy to start. All copies handle all requests.
- **Y axis**: split the application by function. The users service, orders service, and search service each scale independently based on their own load profile.
- **Z axis**: partition data. Route user 1-10M to shard A and user 10M-20M to shard B. Each shard handles a subset of the data.

Most teams start at X, grow into Y (microservices) as teams and load grow, and add Z when a single database or service can no longer hold all the data.

## Read vs write bottlenecks

Most web applications read far more than they write (typical ratios are 10:1 to 100:1 read-to-write). This matters because reads and writes scale differently.

**Reads scale easily**: add read replicas to a database, add a cache in front of the database, add more stateless API servers. Adding replicas increases read throughput proportionally.

**Writes are harder**: every write must go through the primary database node. You can shard to split writes across multiple primaries, but this adds complexity (distributed transactions, cross-shard queries, resharding).

The practical implication: before adding write capacity, always ask whether a cache can absorb the reads so the database is not the bottleneck in the first place.

## Auto-scaling

Auto-scaling adjusts the number of running instances based on observed metrics (CPU utilization, request queue depth, p99 latency). The goal is to provision just enough capacity: too little means degraded performance, too much wastes money.

Auto-scaling works best when:
- Instances start up quickly (seconds, not minutes). Container images and pre-warmed machine images help here.
- Instances are stateless (so any new instance can immediately serve traffic).
- Load spikes are gradual enough that new instances can come online before the existing ones are saturated.

For write-heavy databases, auto-scaling is harder. You cannot just spin up a new primary in seconds. This is why databases are often the bottleneck that forces architectural changes.

## Common bottlenecks in order

As traffic grows, the bottleneck tends to migrate in a predictable sequence:

1. **Single server**: CPU or memory saturated. Fix: scale up, then out.
2. **Database reads**: most of the traffic is read. Fix: add a cache layer (Redis, Memcached), then read replicas.
3. **Database writes**: write throughput hits the primary limit. Fix: sharding, or move high-write data to a purpose-built store (time-series DB, message queue).
4. **Network bandwidth**: large responses or high-frequency polling. Fix: CDN for static assets, compression, efficient serialization (protobuf over JSON).
5. **Application servers**: CPU-bound computation. Fix: horizontal scaling, move expensive work to a background queue.

Identify the actual bottleneck before optimizing. Adding more application servers does nothing if the database is the constraint.

## Estimating required capacity

Quick formula for estimating peak servers needed:

```
peak_rps = daily_requests / 86400 * peak_multiplier
servers_needed = ceil(peak_rps / rps_per_server)
```

Example: 10M daily requests, 3x peak multiplier, 500 RPS per server:

```python
import math

daily = 10_000_000
peak_multiplier = 3
rps_per_server = 500

peak_rps = daily / 86400 * peak_multiplier  # ~347 RPS average * 3 = ~1042 peak
servers = math.ceil(peak_rps / rps_per_server)
print(f"Peak RPS: {peak_rps:.0f}, Servers needed: {servers}")
# Peak RPS: 1042, Servers needed: 3
```

Add a buffer (1.5x-2x) for failure headroom, then size accordingly.

## References

- [The Art of Scalability, Abbott and Fisher](https://akfpartners.com/growth-blog/scale-cube)
- [High Scalability blog](http://highscalability.com/)
- [Designing Data-Intensive Applications, Kleppmann, Chapter 1](https://dataintensive.net/)
- [AWS Well-Architected Framework: Performance Efficiency](https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html)

## Related topics

- [Load Balancing](../load-balancing/), distributing traffic across the horizontally-scaled instances
- [Caching](../caching/), the first line of defense against database read bottlenecks
- [Databases at Scale](../databases/), sharding and replication for write and storage scaling
- [CAP Theorem](../cap-theorem/), the consistency and availability trade-offs that constrain distributed scale
