---
title: SwiftUI, UIKit, navigation, accessibility, and UI behavior tests
description: "Test the same create-note acceptance behavior across SwiftUI and UIKit while keeping framework details at the correct evidence distance."
date: 2026-07-19
tags: [ios, swift, testing, swiftui, uikit, accessibility, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-swiftui-uikit-navigation-accessibility-ui-tests/
series:
  slug: zero-to-ios-hero
  order: 75
---

SwiftUI and UIKit should satisfy the same product acceptance contract even though their view trees, lifecycle models, and navigation mechanics differ.

## Share the scenario, not selectors

The create-note contract is framework-neutral:

```text
Given an empty local library
When the user opens the editor, enters a valid title, and saves
Then the note appears in the library and can be reopened
```

Each app adapter supplies its own launch configuration and automation details. A shared scenario helper can describe user actions such as `openNewNote`, `enterTitle`, and `save`, while SwiftUI and UIKit drivers map those actions to accessible controls.

## Place each UI fact deliberately

- pure validation belongs in domain tests
- presentation state belongs in presentation-model tests
- layout variants belong in previews and focused visual review
- route wiring and critical interaction belong in XCUITest
- accessibility labels, traits, order, actions, and large text need audits beyond screenshots
- platform behavior and assistive technology interaction need Simulator or device evidence

Avoid assertions against private view hierarchy shapes. Refactoring a stack into a custom layout should not break a test when the visible behavior is unchanged.

## Control navigation and data

Launch into a deterministic local fixture, begin from a known route, and wait for meaningful accessibility elements. Do not make UI tests depend on production accounts, network timing, or leftover simulator state.

Snapshots can catch appearance drift, but pixels alone cannot prove VoiceOver wording, focus order, custom actions, keyboard access, or successful persistence.

## Validation boundary

This lesson defines the paired acceptance contract. The SwiftUI and UIKit journeys remain unverified until run against named Xcode schemes and destinations.

## Series navigation

- Previous: [Part 74: Deterministic dependencies and concurrency tests](../2026-07-19-ios-deterministic-dependencies-concurrency-tests/)
- Next: [Part 76: Persistence, migration, networking, and contract tests](../2026-07-19-ios-persistence-migration-network-contract-tests/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Accessibility for UIKit](https://developer.apple.com/documentation/uikit/accessibility-for-uikit) covers UIKit accessibility semantics and behavior.
- [Xcode testing](https://developer.apple.com/documentation/xcode/testing) covers UI test execution and results.

## Related topics

- [Accessibility, localization, and inclusive product design](../2026-07-19-ios-accessibility-localization-inclusive-product-design/)
- [SwiftUI previews, tests, accessibility, and performance](../2026-07-19-swiftui-previews-testing-ui-accessibility-performance/)
