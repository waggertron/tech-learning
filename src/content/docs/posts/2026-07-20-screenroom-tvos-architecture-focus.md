---
title: "ScreenRoom tvOS architecture and focus"
description: "How should route state, focus restoration, shelves, remote input, and profiles cooperate?"
date: 2026-07-20
tags: [ios, swift, case-study, screen]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-screenroom-tvos-architecture-focus/
series:
  slug: zero-to-ios-hero
  order: 124
---

ScreenRoom is a television-first streaming product with an iPhone companion. It treats focus, playback lifetime, account state, access, and progress as durable product concerns rather than details of a player screen.

## Product decision

How should route state, focus restoration, shelves, remote input, and profiles cooperate?

The smallest useful vertical slice is concrete: Represent catalog selection and preferred focus explicitly so a shelf can restore a meaningful item after navigation or data refresh.

## Boundaries that keep the design honest

- Model catalog, profile, entitlement, playback intent, and progress separately so each lifecycle can fail and recover visibly.
- Make focus and remote interaction deterministic across navigation, refreshed shelves, overlays, and profile changes.
- Keep the player in a stable coordinator and persist progress from meaningful playback events.
- Validate poor networks, subtitle and accessibility behavior, account transitions, StoreKit state, and television hardware before release.
- Avoid this failure: Treating focus as a hover decoration rather than the primary television interaction state.

## Release evidence

No ScreenRoom tvOS or iOS target, focus journey, AVPlayer session, media stream, StoreKit transaction, download, remote command, subtitle track, or Apple TV device run was exercised.

This chapter records product and architecture decisions. Apple framework behavior still requires the matching Xcode target, configured service or account where applicable, and named Simulator or physical-device evidence. The browser Swift runner does not validate these Apple SDK surfaces.

## Series navigation

- Previous: [Part 123: ScreenRoom product and content model](../2026-07-20-screenroom-product-content-model/)
- Next: [Part 125: ScreenRoom playback and media lifecycle](../2026-07-20-screenroom-playback-media-lifecycle/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [tvOS](https://developer.apple.com/tvos/)
- [AVFoundation](https://developer.apple.com/documentation/avfoundation)
- [StoreKit](https://developer.apple.com/documentation/storekit)

## Related topics

- [Video capture, editing, playback, and streaming architecture](../2026-07-19-video-capture-editing-playback-streaming-architecture/)
- [StoreKit, subscriptions, offers, and entitlement state](../2026-07-19-storekit-subscriptions-offers-entitlement-state/)

