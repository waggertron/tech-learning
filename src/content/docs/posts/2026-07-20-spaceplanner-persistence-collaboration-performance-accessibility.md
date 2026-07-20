---
title: "SpacePlanner persistence, collaboration, performance, and accessibility"
description: "How do transform conflicts, large assets, shared sessions, captions, and nonspatial alternatives work together?"
date: 2026-07-20
tags: [ios, swift, case-study, space]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-spaceplanner-persistence-collaboration-performance-accessibility/
series:
  slug: zero-to-ios-hero
  order: 139
---

SpacePlanner is a collaborative spatial design case study for Apple Vision Pro. It uses spatial presentation only where scale, placement, and shared context improve planning, and it treats comfort, accessibility, tracking loss, and exit as core product behavior.

## Product decision

How do transform conflicts, large assets, shared sessions, captions, and nonspatial alternatives work together?

The smallest useful vertical slice is concrete: Merge intent-level edits, stream level-of-detail assets progressively, and provide text, audio, keyboard, and two-dimensional alternatives.

## Boundaries that keep the design honest

- Keep projects, transforms, placement intent, undo, and merge policy independent of RealityKit entity lifetime.
- Choose windows, volumes, and immersion from the task, with predictable transitions and an obvious user-controlled exit.
- Load bounded assets progressively and measure frame time, memory, thermal behavior, tracking recovery, and visual stability on hardware.
- Provide accessible labels, captions, contrast, reduced-motion behavior, keyboard or voice paths, and a useful nonspatial alternative.
- Avoid this failure: Applying last-write-wins to an entire scene or requiring spatial input as the only path.

## Release evidence

No SpacePlanner visionOS target, RealityKit scene, ARKit session, asset pipeline, shared session, tracking-loss scenario, accessibility audit, frame profile, comfort review, or Apple Vision Pro device run was exercised.

This chapter records product and architecture decisions. Apple SDK behavior still requires the matching Xcode target, configured service or entitlement where applicable, and named Simulator or physical-device evidence. The browser Swift runner does not validate these Apple SDK surfaces.

## Series navigation

- Previous: [Part 138: SpacePlanner RealityKit, ARKit, interaction, and rendering](../2026-07-20-spaceplanner-realitykit-arkit-interaction-rendering/)
- Next: [Part 140: SpacePlanner testing and release review](../2026-07-20-spaceplanner-testing-release-review/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [visionOS](https://developer.apple.com/documentation/visionos/)
- [RealityKit](https://developer.apple.com/documentation/realitykit)
- [Bringing an ARKit app to visionOS](https://developer.apple.com/documentation/visionos/bringing-your-arkit-app-to-visionos)

## Related topics

- [visionOS, RealityKit, ARKit, immersive spaces, comfort, and assets](../2026-07-19-realitykit-arkit-immersive-spaces-comfort-assets/)
- [Accessibility, localization, and inclusive product design](../2026-07-19-ios-accessibility-localization-inclusive-product-design/)

