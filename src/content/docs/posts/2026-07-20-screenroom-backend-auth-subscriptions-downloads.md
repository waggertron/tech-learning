---
title: "ScreenRoom backend, auth, subscriptions, and downloads"
description: "How do device sign-in, paginated catalog data, StoreKit access, and offline media interact?"
date: 2026-07-20
tags: [ios, swift, case-study, screen]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-screenroom-backend-auth-subscriptions-downloads/
series:
  slug: zero-to-ios-hero
  order: 126
---

ScreenRoom is a television-first streaming product with an iPhone companion. It treats focus, playback lifetime, account state, access, and progress as durable product concerns rather than details of a player screen.

## Product decision

How do device sign-in, paginated catalog data, StoreKit access, and offline media interact?

The smallest useful vertical slice is concrete: Separate device authorization, account session, verified entitlement, catalog paging, and download state into explicit contracts.

## Boundaries that keep the design honest

- Model catalog, profile, entitlement, playback intent, and progress separately so each lifecycle can fail and recover visibly.
- Make focus and remote interaction deterministic across navigation, refreshed shelves, overlays, and profile changes.
- Keep the player in a stable coordinator and persist progress from meaningful playback events.
- Validate poor networks, subtitle and accessibility behavior, account transitions, StoreKit state, and television hardware before release.
- Avoid this failure: Equating successful purchase presentation with durable access or assuming a download is ready before verification completes.

## Release evidence

No ScreenRoom tvOS or iOS target, focus journey, AVPlayer session, media stream, StoreKit transaction, download, remote command, subtitle track, or Apple TV device run was exercised.

This chapter records product and architecture decisions. Apple framework behavior still requires the matching Xcode target, configured service or account where applicable, and named Simulator or physical-device evidence. The browser Swift runner does not validate these Apple SDK surfaces.

## Series navigation

- Previous: [Part 125: ScreenRoom playback and media lifecycle](../2026-07-20-screenroom-playback-media-lifecycle/)
- Next: [Part 127: ScreenRoom performance, accessibility, and resilience](../2026-07-20-screenroom-performance-accessibility-resilience/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [tvOS](https://developer.apple.com/tvos/)
- [AVFoundation](https://developer.apple.com/documentation/avfoundation)
- [StoreKit](https://developer.apple.com/documentation/storekit)

## Related topics

- [Video capture, editing, playback, and streaming architecture](../2026-07-19-video-capture-editing-playback-streaming-architecture/)
- [StoreKit, subscriptions, offers, and entitlement state](../2026-07-19-storekit-subscriptions-offers-entitlement-state/)

