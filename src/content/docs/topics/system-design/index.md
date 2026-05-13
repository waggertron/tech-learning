---
title: System Design
description: "Distributed systems design for interviews and production: scalability, load balancing, caching, databases, message queues, API design, rate limiting, CAP theorem, and consistent hashing."
category: system-design
tags: [system-design, distributed-systems, interviews]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

System design interviews ask you to architect a real-world system from scratch, usually in 45 minutes. Unlike coding interviews, there is no single correct answer. The job is to reason through trade-offs clearly, ask the right clarifying questions, and make defensible decisions under constraints.

The same skills matter in production. A system that starts as a single process eventually needs to handle more traffic, store more data, and survive more failures. Understanding the canonical building blocks means you can reach for the right tool without reinventing it every time.

## Interview prep

- [Interview Framework](./interview-framework/), the 4-step approach: requirements, estimation, high-level design, deep dives, with time allocations and what interviewers score
- [Back-of-Envelope Estimation](./estimation/), latency table, storage units, QPS and bandwidth formulas, fully worked examples for Twitter, YouTube, and WhatsApp

## Core building blocks

- [Scalability](./scalability/), vertical vs horizontal scaling, stateless services, the scale cube, auto-scaling
- [Load Balancing](./load-balancing/), algorithms, L4 vs L7, health checks, sticky sessions
- [Caching](./caching/), cache-aside, read-through, write-through, write-behind, eviction, CDN, invalidation
- [Databases at Scale](./databases/), SQL vs NoSQL trade-offs, sharding, replication, indexing
- [Message Queues](./message-queues/), queue vs pub/sub, delivery guarantees, Kafka, RabbitMQ
- [API Design](./api-design/), REST principles, GraphQL, gRPC, versioning, idempotency, pagination
- [Rate Limiting](./rate-limiting/), token bucket, leaky bucket, sliding window, where to enforce
- [CAP Theorem](./cap-theorem/), consistency vs availability under network partition, PACELC
- [Consistent Hashing](./consistent-hashing/), the ring, virtual nodes, resharding without full remapping

## Case studies

End-to-end walkthroughs of six canonical interview problems, each with clarifying questions, estimation, high-level design, deep dives, failure modes, and key takeaways.

- [URL Shortener](./case-studies/url-shortener/), ID generation, base62 encoding, redirect caching, analytics pipeline
- [Social Feed](./case-studies/social-feed/), fanout strategies, hybrid push/pull, the celebrity problem, ML ranking
- [Video Streaming](./case-studies/video-streaming/), chunked upload, transcoding pipeline, adaptive bitrate, CDN strategy
- [Chat System](./case-studies/chat-system/), message ordering, WebSocket routing, exactly-once delivery, group chat
- [Notification System](./case-studies/notification-system/), multi-channel delivery, priority queues, deduplication, per-user rate limiting
- [Ride Sharing](./case-studies/ride-sharing/), geospatial indexing at scale, matching, real-time tracking, surge pricing

## Advanced patterns

- [Microservices vs Monolith](./microservices/), Conway's Law, domain-driven boundaries, the modular monolith, Strangler Fig migration
- [Circuit Breaker and Resilience](./circuit-breaker/), circuit breaker state machine, bulkhead isolation, retry with jitter, composing patterns
- [Event Sourcing and CQRS](./event-sourcing/), append-only event log, projections, snapshots, separating read and write models
- [Distributed Locking](./distributed-locking/), Redis SETNX, Redlock, ZooKeeper ephemeral nodes, fencing tokens
- [Saga Pattern](./saga-pattern/), choreography vs orchestration, compensating transactions, pivotal transactions, isolation problems

## The system design interview format

Most interviews follow the same rough structure:

1. **Clarify requirements** (5 min). Functional requirements (what does the system do?) and non-functional requirements (how many users, what latency, what durability?). Nail down scale: QPS, data volume, read/write ratio.
2. **High-level design** (10 min). Sketch the major components on a whiteboard: clients, API layer, services, storage, caches, queues.
3. **Deep dive** (20 min). The interviewer picks 1-2 components to drill into. Be ready to justify every choice.
4. **Wrap-up** (5 min). Discuss bottlenecks, failure modes, monitoring, and what you would do next.

## Back-of-envelope estimates

Knowing rough latency and throughput numbers lets you size components quickly:

| Operation | Approximate latency |
| --- | --- |
| L1 cache reference | 1 ns |
| L2 cache reference | 4 ns |
| Main memory reference | 100 ns |
| SSD random read | 150 us |
| HDD seek | 10 ms |
| Round trip within same datacenter | 500 us |
| Round trip across datacenters | 150 ms |

Rule of thumb: memory is 1000x faster than SSD, SSD is 1000x faster than HDD. Anything that must be fast should live in memory or a cache.

## How to use this section

Each page covers one building block: the concept, the trade-offs, and when to pick it. They cross-link heavily because the topics are interconnected. Your caching strategy depends on your consistency model, which is constrained by CAP. Your storage choice affects how you shard, and your sharding strategy determines whether consistent hashing applies.

For interview prep, read in order. For production reference, jump to the relevant building block.

## Related topics

- [Named Algorithms](../cs/named-algorithms/), algorithms that appear inside system components: Dijkstra in routing, BFS in crawlers, consistent hashing in storage
- [Graph Theory](../cs/graph-theory/), the mathematical foundation for distributed system topology
- [Operations](../ops/), the deployment layer above system design: Kubernetes, Terraform, GitOps
