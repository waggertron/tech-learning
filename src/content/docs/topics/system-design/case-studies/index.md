---
title: System Design Case Studies
description: "End-to-end walkthroughs of seventeen canonical system design interview problems: URL shortener, social feed, video streaming, chat, notifications, ride sharing, plus an eleven-part progressive series from Bitly through eBay."
parent: system-design
tags: [system-design, case-studies, interviews]
status: draft
created: 2026-05-06
updated: 2026-05-21
---

Each case study applies the [interview framework](../interview-framework/) to a canonical [system design](../) problem. The format is consistent: clarifying questions, estimation, high-level design with Mermaid diagrams, deep dives on the most interesting components, failure modes, and key takeaways.

These problems cover the most commonly asked designs across Google, Meta, Amazon, Uber, Stripe, and other top companies. Master these and you will recognize the underlying patterns in any new problem you face.

## Standalone case studies

Six standalone walkthroughs, each covering a distinct design space:

- [URL Shortener](./url-shortener/), ID generation, base62 encoding, redirect caching, and analytics pipelines
- [Social Feed](./social-feed/), fanout strategies, hybrid push/pull, ML ranking, and the celebrity problem
- [Video Streaming](./video-streaming/), chunked upload, transcoding pipelines, adaptive bitrate, and CDN strategy
- [Chat System](./chat-system/), message ordering, WebSocket connection management, exactly-once delivery, and group chat scaling
- [Notification System](./notification-system/), multi-channel delivery, priority queues, deduplication, and [rate limiting](../rate-limiting/) per user
- [Ride Sharing](./ride-sharing/), geospatial indexing, real-time location at scale, matching, and surge pricing

## Progressive series: ten systems, ten layers

This ten-part series builds up a shared vocabulary one entry at a time. Each system introduces new concepts and explicitly reuses patterns from every prior entry. Reading in order, you accumulate a mental toolkit: by entry ten, you can identify the same underlying structure (Kafka pipeline, Redis cache, consistent hashing) across wildly different products.

| # | System | New concepts introduced | Patterns carried forward |
| --- | --- | --- | --- |
| 1 | [Bitly](./bitly/) | Snowflake ID generation, Redis redirect cache, Kafka analytics pipeline | Series foundation |
| 2 | [Dropbox](./dropbox/) | Block deduplication (SHA-256), delta sync, metadata vs block storage | ID generation, Kafka, Redis |
| 3 | [Ticketmaster](./ticketmaster/) | Distributed locking, flash sale queue, inventory reservation | Redis, Kafka, ID generation |
| 4 | [Facebook News Feed](./facebook-news-feed/) | Fan-out on write vs read, celebrity problem, Redis sorted sets | Kafka, Redis, distributed locking |
| 5 | [WhatsApp](./whatsapp/) | WebSocket fleet, sequence-number ordering, exactly-once delivery, presence | Redis routing table, Kafka, ID generation |
| 6 | [LeetCode](./leetcode/) | Sandboxed execution, warm container pools, leaderboard sorted sets | Kafka job queue, Redis sorted sets, WebSocket |
| 7 | [Uber](./uber/) | Redis GEO, ETA-based matching, stream-based surge pricing | WebSocket routing, Kafka, Redis |
| 8 | [Web Crawler](./web-crawler/) | URL frontier, politeness, Bloom filter dedup, SimHash | Kafka URL queue, consistent hashing, Redis |
| 9 | [Ad Click Aggregator](./ad-click-aggregator/) | Time-windowed aggregation, idempotent counting, lambda architecture | Kafka stream, consistent hashing, Redis counters |
| 10 | [Facebook Post Search](./facebook-post-search/) | Inverted index, BM25 ranking, typeahead, privacy filtering | Kafka indexing pipeline, consistent hashing, Redis cache |
| 11 | [eBay](./ebay/) | Auction state machine, proxy bidding, bid sniper problem, payment escrow | Distributed locking, Redis sorted sets, WebSocket routing, Kafka, idempotent writes |

## The underlying patterns

Most system design problems are variations of a small set of recurring challenges:

| Challenge | Appears in |
| --- | --- |
| Write fan-out (1 write, N readers) | Social feed, notifications, ride sharing, news feed |
| Exactly-once semantics | Chat, WhatsApp, payments, ad click aggregator |
| Geospatial indexing | Ride sharing, Uber |
| Pipeline processing (ingest, transform, store) | Video streaming, web crawler, post search, ad clicks |
| ID generation at high QPS | Bitly, Dropbox, WhatsApp, LeetCode |
| Real-time communication | Chat, WhatsApp, LeetCode, Uber |
| Distributed locking | Ticketmaster, news feed |
| Bloom filter deduplication | Web crawler |

Recognizing the pattern in a new problem is more valuable than memorizing each design individually.

## Related topics

- [Interview Framework](../interview-framework/), the 4-step approach these case studies follow
- [Back-of-Envelope Estimation](../estimation/), the numbers behind the estimation sections
- [Caching](../caching/), a key component in every case study
- [Message Queues](../message-queues/), the async backbone in notifications, streaming, and fan-out
- [Consistent Hashing](../consistent-hashing/), the sharding primitive used in Bitly, web crawler, and post search
