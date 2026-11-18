---
title: "SpacePlanner: a product design brief"
description: "A bounded spatial layout assignment with reversible edits, tracking loss, and nonspatial alternatives."
date: 2026-07-20
tags: [ios, swift, case-study, space]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-spaceplanner-product-comfort-spatial-design/
---

A person places a small set of furniture objects to compare a room arrangement. Spatial presentation is useful only if scale and manipulation improve that decision. A window-based list and numeric controls remain viable ways to inspect and change the arrangement.

This is a design brief and project assignment. It does not describe a completed application.

## One useful vertical slice

Use one room and a small fixed asset set. Support select, move, rotate, undo, save, and reopen. Begin in a bounded presentation. Defer shared live editing, arbitrary asset ingestion, physics simulation, and whole-home scanning.

## Model the durable state

```text
Project(id, roomDimensions, revision)
    +-> Placement(id, assetID, position, orientation)

select -> preview transform -> validate -> commit command
              |                              |
              +-> cancel                     +-> undo
```

Domain placements are values. Rendered entities project those values and send edit intent back. A command stores enough prior state to reverse an accepted edit. Asset loading and tracking quality are separate from the project model.

## Compare the main alternatives

A window can serve editing and inspection without immersive complexity. A volume may support useful spatial comparison. Immersion requires a stronger reason and a clear exit. Compare snapping rules against actual room dimensions, and keep a numeric edit alternative when direct manipulation is imprecise or inaccessible.

## Walk through a failure

If tracking quality drops while a transform is previewed, stop committing uncertain positions and preserve the last accepted placement. Asset load failure shows the affected item and retains the project. If persistence fails, keep the edit session and a visible recovery action. Do not replace a user's arrangement with default furniture to hide an error.

## Acceptance scenarios

1. Move and rotate an item, undo both commands, and recover the exact prior placement.
2. Interrupt a preview before commit and retain the last accepted project revision.
3. Save and reopen with one missing asset while preserving all placement records.
4. Complete equivalent edits without direct spatial gestures, then assess comfort on physical hardware.

A deterministic model test can prove transition and identity rules. The platform adapter then needs its own interface, permission, interruption, and integration checks. Keep evidence tied to the actual target and destination rather than treating a design review as an executed feature.

## Implementation boundary

No SpacePlanner app target, service integration, account transaction, or hardware journey is supplied by this brief. Use the [Field Notes capstone](../2026-07-19-swiftui-field-notes-capstone/) for the implemented notebook path. Build this assignment only when its distinct user task justifies the extra platform and validation cost.

## References

- [RealityKit](https://developer.apple.com/documentation/realitykit) documents the central framework boundary for this assignment.
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) provides platform interaction and accessibility guidance.

## Related topics

- [Apple platform selection](../2026-07-19-one-product-across-apple-platforms/)
- [Apple capability selection](../2026-07-19-widgetkit-live-activities/)

[Series reading guide](../series/zero-to-ios-hero/)
