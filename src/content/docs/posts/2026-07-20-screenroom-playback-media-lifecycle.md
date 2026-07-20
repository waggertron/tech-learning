---
title: "ScreenRoom playback and media lifecycle"
description: "How do playback ownership, remote commands, subtitles, interruptions, and durable progress fit together?"
date: 2026-07-20
tags: [ios, swift, case-study, screen]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-screenroom-playback-media-lifecycle/
series:
  slug: zero-to-ios-hero
  order: 125
---

ScreenRoom is a television-first streaming product with an iPhone companion. It treats focus, playback lifetime, account state, access, and progress as durable product concerns rather than details of a player screen.

## Product decision

How do playback ownership, remote commands, subtitles, interruptions, and durable progress fit together?

The smallest useful vertical slice is concrete: Give a playback coordinator the player lifetime, selected media, resume position, command handling, and observable event stream.

## Boundaries that keep the design honest

- Model catalog, profile, entitlement, playback intent, and progress separately so each lifecycle can fail and recover visibly.
- Make focus and remote interaction deterministic across navigation, refreshed shelves, overlays, and profile changes.
- Keep the player in a stable coordinator and persist progress from meaningful playback events.
- Validate poor networks, subtitle and accessibility behavior, account transitions, StoreKit state, and television hardware before release.
- Avoid this failure: Placing player ownership in a reusable cell or disposable view.

## Release evidence

No ScreenRoom tvOS or iOS target, focus journey, AVPlayer session, media stream, StoreKit transaction, download, remote command, subtitle track, or Apple TV device run was exercised.

This chapter records product and architecture decisions. Apple framework behavior still requires the matching Xcode target, configured service or account where applicable, and named Simulator or physical-device evidence. The browser Swift runner does not validate these Apple SDK surfaces.

## Series navigation

- Previous: [Part 124: ScreenRoom tvOS architecture and focus](../2026-07-20-screenroom-tvos-architecture-focus/)
- Next: [Part 126: ScreenRoom backend, auth, subscriptions, and downloads](../2026-07-20-screenroom-backend-auth-subscriptions-downloads/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [tvOS](https://developer.apple.com/tvos/)
- [AVFoundation](https://developer.apple.com/documentation/avfoundation)
- [StoreKit](https://developer.apple.com/documentation/storekit)

## Related topics

- [Video capture, editing, playback, and streaming architecture](../2026-07-19-video-capture-editing-playback-streaming-architecture/)
- [StoreKit, subscriptions, offers, and entitlement state](../2026-07-19-storekit-subscriptions-offers-entitlement-state/)

