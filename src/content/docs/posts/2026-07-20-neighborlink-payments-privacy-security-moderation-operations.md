---
title: "NeighborLink payments, privacy, security, and moderation operations"
description: "Which commerce flow fits physical goods, and how should reports, blocks, retention, and audit events work?"
date: 2026-07-20
tags: [ios, swift, case-study, neighbor]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-neighborlink-payments-privacy-security-moderation-operations/
series:
  slug: zero-to-ios-hero
  order: 133
---

NeighborLink is a UIKit-heavy community marketplace where client architecture, backend authority, real-time collaboration, commerce, and moderation must reinforce the same trust model.

## Product decision

Which commerce flow fits physical goods, and how should reports, blocks, retention, and audit events work?

The smallest useful vertical slice is concrete: Use Apple Pay where eligible, minimize exchanged data, and record append-only moderator decisions with reason, actor role, and appeal state.

## Boundaries that keep the design honest

- Keep authentication tokens, transport DTOs, and framework callbacks outside domain and application policy.
- Use stable client operation IDs, durable outboxes, explicit server ordering, and idempotent reconciliation for ambiguous networks.
- Treat approximate location, media, chat, reports, blocks, retention, and audit access as one privacy and security surface.
- Exercise hostile inputs, role changes, inaccessible content, delayed services, and operational moderation before release.
- Avoid this failure: Using StoreKit for person-to-person physical goods or exposing precise location when an approximate area is enough.

## Release evidence

No NeighborLink UIKit target, backend, identity provider, upload, message stream, push environment, Apple Pay merchant setup, moderation system, load test, or adversarial device journey was implemented or exercised.

This chapter records product and architecture decisions. Apple SDK behavior still requires the matching Xcode target, configured service or entitlement where applicable, and named Simulator or physical-device evidence. The browser Swift runner does not validate these Apple SDK surfaces.

## Series navigation

- Previous: [Part 132: NeighborLink chat, offline writes, push, and deep links](../2026-07-20-neighborlink-chat-offline-writes-push-deep-links/)
- Next: [Part 134: NeighborLink quality and release review](../2026-07-20-neighborlink-quality-release-review/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [UIKit](https://developer.apple.com/documentation/uikit)
- [UserNotifications](https://developer.apple.com/documentation/usernotifications)
- [Apple Pay](https://developer.apple.com/apple-pay/)

## Related topics

- [Networking, authentication, pagination, real-time updates, and resilience](../2026-07-19-ios-networking-authentication-realtime-resilience/)
- [Apple Pay, passes, Wallet, and transaction UX](../2026-07-19-apple-pay-passes-wallet-transaction-ux/)

