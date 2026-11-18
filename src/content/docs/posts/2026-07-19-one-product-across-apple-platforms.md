---
title: "Choosing an Apple platform for one product"
description: "Compare Apple platforms by user task, input, lifecycle, and evidence costs before choosing what to share."
date: 2026-07-19
tags: [swift, swiftui, apple-platforms, architecture, multiplatform]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-one-product-across-apple-platforms/
---

A notebook used for a ten-second capture on a phone and a two-hour research session on a Mac can share records without sharing screen structure. Begin with the task at each device, then decide which rules and adapters can be reused.

## Compare the interaction before the framework

| Platform | Primary pressure | A useful product slice | Evidence to collect |
| --- | --- | --- | --- |
| iPhone | interruption, one-handed input, short visits | capture and retrieve a note | save recovery, relaunch, accessible editing |
| iPad | resizable workspaces, touch plus pointer/keyboard | browse and edit side by side | resizing, focus, shortcuts, independent windows |
| Mac | long sessions, menus, files, multiple windows | research, import, organize, export | document lifetime, commands, keyboard, sandbox access |
| Watch | brief attention, constrained input and energy | mark an event or resume a session | paired/unpaired behavior, delayed transfer, hardware battery |
| Apple TV | remote focus and distant reading | select and watch shared material | focus restoration, remote commands, media interruptions |
| Vision Pro | spatial placement, comfort, alternate input | place or compare objects when space helps | tracking loss, exit paths, device comfort and frame costs |

A platform deserves its own surface when it improves a real task. Shipping the same form everywhere often reproduces the limitations of the first device. Avoid adding a watch, television, or immersive target just to claim ecosystem coverage.

## Share rules, adapt presentation

```text
Note values and validation
          |
          v
Application operations
    ^     ^      ^
    |     |      |
 phone  tablet  desktop adapters
```

Stable identity, validation, search semantics, and import rules can live in a shared package. Window selection, navigation stacks, focus, keyboard commands, file picking, and framework lifecycle belong near the platform presentation.

For example, a note deletion command can be shared. The phone may present a swipe action with Undo, while the Mac exposes a menu command for the focused window. Both invoke the same rule; neither needs to emulate the other's view hierarchy.

## iPad and Mac: make workspace ownership explicit

Two windows may share a durable library while holding different selection, search, and draft state. Closing one window should not discard another window's draft. A command should act on the focused workspace, not an arbitrary global selection.

On iPad, test narrow and wide windows instead of branching on device name. On Mac, start with document/window behavior and keyboard access. SwiftUI supports declarative scenes; AppKit offers desktop-specific object APIs, and Mac Catalyst can adapt an existing UIKit application. Choose according to needed controls and existing code, then verify the difficult interaction in a small prototype. Reuse percentage alone does not measure usability.

## Watch and television: change the task size

A watch is useful for a quick action or ongoing activity, not a compressed phone settings hierarchy. Decide which device owns a session and what happens when messages arrive late or twice. The product should remain honest while disconnected.

Television navigation needs stable focus destinations and visible recovery when a shelf refreshes or media becomes unavailable. The selected title, access decision, player lifetime, and resume position have separate lifetimes. A disposable catalog cell should not own the playback session.

## Spatial presentation: earn the extra dimension

Start with a window when it serves the task. A volume or immersive space should add useful manipulation, context, or comparison. Specify an exit, interruption, tracking-loss response, and nonspatial alternative before expanding the scene.

A Simulator screenshot cannot establish physical comfort or tracking reliability. Those claims need the relevant hardware and an observed task. The [SpacePlanner design brief](../2026-07-20-spaceplanner-product-comfort-spatial-design/) turns those pressures into a bounded project assignment.

## Choose a first platform

Write the primary user task, its completion signal, the necessary inputs, and the failure that makes the task unusable. Pick the smallest platform scope that can deliver that loop. Add another platform after its distinct task and validation cost are clear.

This selection guide does not demonstrate completed watchOS, tvOS, macOS, or visionOS applications. The [Field Notes path](../2026-07-19-swiftui-field-notes-capstone/) supplies the core notebook example; optional platform projects remain design briefs.

## References

- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) describe platform interaction conventions.
- [Scenes](https://developer.apple.com/documentation/swiftui/scenes) describes system-managed presentations.
- [Watch Connectivity](https://developer.apple.com/documentation/watchconnectivity) and [focus-based navigation](https://developer.apple.com/documentation/uikit/focus-based-navigation) describe distinct cross-device and television boundaries.

## Related topics

- [SwiftUI scenes and windows](../2026-07-19-swiftui-scenes-windows-navigation-commands-platform/)
- [Apple capability selection](../2026-07-19-widgetkit-live-activities/)

[Series reading guide](../series/zero-to-ios-hero/)
