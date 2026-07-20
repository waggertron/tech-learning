---
title: RealityKit, ARKit, immersive spaces, comfort, and assets
description: "Build spatial content from entities, components, systems, tracking state, indirect gestures, asset pipelines, and explicit comfort limits."
date: 2026-07-19
tags: [visionos, realitykit, arkit, spatial-computing, accessibility]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-realitykit-arkit-immersive-spaces-comfort-assets/
series:
  slug: zero-to-ios-hero
  order: 96
---

RealityKit organizes rendered objects as entities with components and systems. ARKit supplies device and world understanding where supported. Product behavior must tolerate changing tracking quality and unavailable capabilities.

## Design the capability

- Anchor an annotation to a stable domain ID and keep transform, asset, and synchronization data separate.
- Represent tracking as unavailable, initializing, limited, and ready rather than assuming perfect coordinates.
- Use targeted gestures and accessible alternatives. Avoid moving the user or filling the room without clear control.
- Version and optimize assets, budget memory and draw cost, and provide a nonspatial fallback for the underlying task.

## Validation boundary

No RealityKit scene, ARKit provider, immersive space, asset pipeline, tracking session, or headset run occurred.

## Series navigation

- Previous: [Part 95: visionOS windows, volumes, ornaments, and spatial input](../2026-07-19-visionos-windows-volumes-ornaments-spatial-input/)
- Next: [Part 97: WidgetKit and Live Activities](../2026-07-19-widgetkit-live-activities/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [RealityKit](https://developer.apple.com/documentation/realitykit)
- [ARKit](https://developer.apple.com/documentation/arkit)
- [visionOS](https://developer.apple.com/documentation/visionos)

## Related topics

- [visionOS presentation](../2026-07-19-visionos-windows-volumes-ornaments-spatial-input/)
- [Performance and device matrices](../2026-07-19-ios-performance-memory-energy-launch-device-matrices/)
