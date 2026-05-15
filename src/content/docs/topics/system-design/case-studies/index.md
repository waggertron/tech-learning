---
title: System Design Case Studies
description: "End-to-end walkthroughs of six canonical system design interview problems: URL shortener, social feed, video streaming, chat system, notification system, and ride sharing."
parent: system-design
tags: [system-design, case-studies, interviews]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

Each case study applies the [interview framework](../interview-framework/) to a canonical [system design](../) problem. The format is consistent: clarifying questions, estimation, high-level design, deep dives on the most interesting components, failure modes, and key takeaways.

These six problems cover the most commonly asked designs across Google, Meta, Amazon, Uber, Stripe, and other top companies. Master these and you will recognize the underlying patterns in any new problem you face.

## Case studies

- [URL Shortener](./url-shortener/), ID generation, base62 encoding, redirect caching, and analytics pipelines
- [Social Feed](./social-feed/), fanout strategies, hybrid push/pull, ML ranking, and the celebrity problem
- [Video Streaming](./video-streaming/), chunked upload, transcoding pipelines, adaptive bitrate, and CDN strategy
- [Chat System](./chat-system/), message ordering, WebSocket connection management, exactly-once delivery, and group chat scaling
- [Notification System](./notification-system/), multi-channel delivery, priority queues, deduplication, and [rate limiting](../rate-limiting/) per user
- [Ride Sharing](./ride-sharing/), geospatial indexing, real-time location at scale, matching, and surge pricing

## The underlying patterns

Most system design problems are variations of a small set of recurring challenges:

| Challenge | Appears in |
| --- | --- |
| Write fan-out (1 write, N readers) | Social feed, notifications, ride sharing |
| Exactly-once semantics | Chat, payments, notifications |
| Geospatial indexing | Ride sharing, proximity search, delivery |
| Pipeline processing (ingest, transform, store) | Video streaming, web crawler, search |
| ID generation at high QPS | URL shortener, any write-heavy system |
| Real-time communication | Chat, ride sharing, live streaming |

Recognizing the pattern in a new problem is more valuable than memorizing each design individually.

## Related topics

- [Interview Framework](../interview-framework/), the 4-step approach these case studies follow
- [Back-of-Envelope Estimation](../estimation/), the numbers behind the estimation sections
- [Caching](../caching/), a key component in every case study
- [Message Queues](../message-queues/), the async backbone in notifications, streaming, and fan-out
