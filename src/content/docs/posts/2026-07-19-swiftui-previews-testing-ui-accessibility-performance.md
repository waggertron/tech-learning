---
title: SwiftUI previews, tests, accessibility, and performance
description: "Place fixtures, Swift Testing checks, UI journeys, accessibility audits, and measurements at the distance that proves each risk."
date: 2026-07-19
tags: [ios, swift, swiftui, testing, accessibility]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-previews-testing-ui-accessibility-performance/
series:
  slug: zero-to-ios-hero
  order: 43
---

A preview shows a chosen state. A unit test proves a rule. A UI journey proves the controls are wired through the application. Each answers a different question.

## Begin with deterministic product behavior

The package suite covers validated titles/tags/coordinates, fixed identity/time, save state transitions, failure, repository replacement/deletion, reopen, corrupt stores, atomic replacement failure, row packing, and cancellable latest-request loading.

Run it from `companion/field-notes`:

```bash
./scripts/test-package.sh
```

These checks passed on Swift 6.3.3. They do not require an Apple UI runtime.

## Launch a separate UI store

Both app drivers use these actual startup switches:

```swift
app.launchArguments = [
    "--ui-testing", "--store-name", "save-failure",
    "--reset-store", "--fail-first-save"
]
app.launch()
```

The debug composition root resolves a separate file, resets it only when requested, and can reject the first save. The retry then reaches the real file adapter. Production startup ignores the test switches.

`FieldNotesSwiftUIUITests` and `FieldNotesUIKitUITests` each contain a create/edit/relaunch journey and a failure/retry journey. Their assertions target visible titles, fields, actions, and recovery copy. Relaunch omits `--reset-store`, so the saved note has to come from disk.

## Add previews for risky geometry

`TagFlowLayout.swift` includes narrow large-text and right-to-left preview cases. The pure row-packing algorithm has separate tests, so a visual failure can be distinguished from incorrect geometry. Neither surface proves VoiceOver ordering, actual text measurement, or interaction by itself.

## Keep accessibility and performance evidence honest

Inspect large text, reading order, keyboard traversal, contrast, and reduced motion on real rendered screens. A test identifier is not an accessible name. Measure launch and scrolling using a fixed data fixture and named device conditions before reporting performance.

The app, migration, and UI-test files were syntax-parsed only. Xcode builds, UI execution, preview rendering, accessibility audits, Instruments, and physical-device performance remain unverified because this environment has Command Line Tools without full Xcode.

## Series navigation

- Previous: [Part 42: SwiftUI scenes, windows, navigation, and commands](../2026-07-19-swiftui-scenes-windows-navigation-commands-platform/)
- Next: [Part 44: SwiftUI Field Notes capstone](../2026-07-19-swiftui-field-notes-capstone/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Previewing your app's interface in Xcode](https://developer.apple.com/documentation/xcode/previewing-your-apps-interface-in-xcode) covers previews.
- [Swift Testing](https://developer.apple.com/documentation/testing) covers native Swift behavior tests.
- [Testing your apps in Xcode](https://developer.apple.com/documentation/xcode/testing) covers plans, UI tests, and results.

## Related topics

- [Accessibility, localization, and inclusive product design](../2026-07-19-ios-accessibility-localization-inclusive-product-design/)
- [Learning by building, testing, and debugging](../2026-07-16-learning-by-building-debugging/)
