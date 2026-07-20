---
title: "NeighborLink architecture, identity, and API contracts"
description: "How do authentication, authorization, pagination, uploads, and real-time events stay testable?"
date: 2026-07-20
tags: [ios, swift, case-study, neighbor]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-neighborlink-architecture-identity-api-contracts/
series:
  slug: zero-to-ios-hero
  order: 130
---

NeighborLink is a UIKit-heavy community marketplace where client architecture, backend authority, real-time collaboration, commerce, and moderation must reinforce the same trust model.

## Product decision

How do authentication, authorization, pagination, uploads, and real-time events stay testable?

The smallest useful vertical slice is concrete: Put typed transport, token refresh, DTO mapping, paged queries, upload state, and message streams behind application-owned contracts.

## Boundaries that keep the design honest

- Keep authentication tokens, transport DTOs, and framework callbacks outside domain and application policy.
- Use stable client operation IDs, durable outboxes, explicit server ordering, and idempotent reconciliation for ambiguous networks.
- Treat approximate location, media, chat, reports, blocks, retention, and audit access as one privacy and security surface.
- Exercise hostile inputs, role changes, inaccessible content, delayed services, and operational moderation before release.
- Avoid this failure: Letting screens call endpoints directly or trusting client-provided roles and ownership.

## Release evidence

No NeighborLink UIKit target, backend, identity provider, upload, message stream, push environment, Apple Pay merchant setup, moderation system, load test, or adversarial device journey was implemented or exercised.

This chapter records product and architecture decisions. Apple SDK behavior still requires the matching Xcode target, configured service or entitlement where applicable, and named Simulator or physical-device evidence. The browser Swift runner does not validate these Apple SDK surfaces.

## Series navigation

- Previous: [Part 129: NeighborLink product, trust, and moderation](../2026-07-20-neighborlink-product-trust-moderation/)
- Next: [Part 131: NeighborLink UIKit feed, search, forms, camera, and maps](../2026-07-20-neighborlink-uikit-feed-search-forms-camera-maps/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [UIKit](https://developer.apple.com/documentation/uikit)
- [UserNotifications](https://developer.apple.com/documentation/usernotifications)
- [Apple Pay](https://developer.apple.com/apple-pay/)

## Related topics

- [Networking, authentication, pagination, real-time updates, and resilience](../2026-07-19-ios-networking-authentication-realtime-resilience/)
- [Apple Pay, passes, Wallet, and transaction UX](../2026-07-19-apple-pay-passes-wallet-transaction-ux/)

