---
title: AVKit, AVFoundation, playback, streaming, and media sessions
description: "Compose system playback, durable position, interruptions, remote commands, subtitles, Picture in Picture, and adaptive streaming before custom rendering."
date: 2026-07-19
tags: [ios, tvos, avkit, avfoundation, media, streaming]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-avkit-avfoundation-playback-streaming-media-sessions/
series:
  slug: zero-to-ios-hero
  order: 94
---

Start media playback with the highest-level system surface that satisfies the product. AVKit supplies standard playback UI while AVFoundation owns detailed assets, timing, capture, composition, and transport.

## Design the capability

- Keep player state explicit: idle, preparing, ready, playing, paused, interrupted, stalled, failed, and ended.
- Persist resumable position by stable media identity and reconcile it with asset duration and server progress.
- Configure audio session and remote commands around user intent, interruptions, route changes, and background policy.
- Use supported streaming formats, subtitles, accessibility tracks, and Picture in Picture before creating custom controls.

## Validation boundary

No media asset, stream, audio route, interruption, remote command, or Picture in Picture flow was executed.

## Series navigation

- Previous: [Part 93: tvOS focus, remote input, shelves, and navigation](../2026-07-19-tvos-focus-remote-input-shelves-navigation/)
- Next: [Part 95: visionOS windows, volumes, ornaments, and spatial input](../2026-07-19-visionos-windows-volumes-ornaments-spatial-input/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [AVKit](https://developer.apple.com/documentation/avkit)
- [AVFoundation](https://developer.apple.com/documentation/avfoundation)
- [Media Player](https://developer.apple.com/documentation/mediaplayer)

## Related topics

- [tvOS focus and navigation](../2026-07-19-tvos-focus-remote-input-shelves-navigation/)
- [Concurrency architecture](../2026-07-19-ios-concurrency-architecture-isolation-cancellation-lifecycle/)
