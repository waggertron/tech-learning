---
title: tvOS focus, remote input, shelves, and navigation
description: "Build a ten-foot interface where focus, remote input, readable hierarchy, restoration, and media-first navigation replace direct touch."
date: 2026-07-19
tags: [tvos, swiftui, uikit, focus, remote-input]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-tvos-focus-remote-input-shelves-navigation/
series:
  slug: zero-to-ios-hero
  order: 93
---

tvOS interaction is focus driven. The selected element must remain visually clear, semantically meaningful, reachable by remote and accessibility input, and stable as content changes.

## Design the capability

- Model focus identity alongside route and selection so restoration can recover a meaningful item.
- Lay out large readable groups with predictable directional movement and few deep choices.
- Remote gestures report intent. Avoid hover-only ornament or phone tab patterns that hide destination context.
- Load shelves incrementally and preserve useful content during refresh or network failure.

## Validation boundary

No tvOS target, focus engine run, Siri Remote input, television layout, or device accessibility check was available.

## Series navigation

- Previous: [Part 92: Workouts, complications, Smart Stack, and watch constraints](../2026-07-19-watchos-workouts-complications-smart-stack-constraints/)
- Next: [Part 94: AVKit, AVFoundation, playback, streaming, and media sessions](../2026-07-19-avkit-avfoundation-playback-streaming-media-sessions/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Focus-based navigation](https://developer.apple.com/documentation/uikit/focus-based-navigation)
- [tvOS](https://developer.apple.com/documentation/tvos-apps)
- [Designing for tvOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos)

## Related topics

- [One product across platforms](../2026-07-19-one-product-across-apple-platforms/)
- [Information architecture and navigation](../2026-07-19-ios-information-architecture-navigation/)
