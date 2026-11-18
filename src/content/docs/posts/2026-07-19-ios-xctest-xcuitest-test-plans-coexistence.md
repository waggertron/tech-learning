---
title: XCTest, XCUITest, test plans, and framework coexistence
description: "Keep XCTest where UI automation, performance metrics, existing suites, and Xcode test plans provide unique value alongside Swift Testing."
date: 2026-07-19
tags: [ios, swift, testing, xctest, xcuitest, test-plans, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-xctest-xcuitest-test-plans-coexistence/
series:
  slug: zero-to-ios-hero
  order: 72
---

XCTest remains the right tool for XCUITest interface automation, performance measurement, Objective-C interoperability, and established suites whose rewrite would add cost without stronger evidence.

## Give one UI journey a controlled launch

```text
Given an empty deterministic local store
When the user creates a note with a valid title
Then the note appears in the library
When the app terminates and relaunches using the same store
Then the same note can be reopened and edited
```

The companion supplies separate drivers at `Tests/SwiftUIUITests/FieldNotesSwiftUIUITests.swift` and `Tests/UIKitUITests/FieldNotesUIKitUITests.swift`. Both use the `--ui-testing`, `--store-name`, and `--reset-store` launch contract. The relaunch step omits reset so it checks actual persistence rather than recreating the fixture.

Each driver opens New Note, attempts an invalid save, enters a title, saves, edits, terminates, and reopens the same store. A separate failed-save journey checks that the draft survives and retry creates one note. The two adapters share the acceptance behavior, not private view hierarchies or assumptions about identical screen structure.

Launch into deterministic local data and wait for meaningful accessibility elements. Stable visible labels are useful selectors; identifiers help when labels are localized or duplicated. Keep test-only launch configuration unavailable in ordinary release use. The capstones link the current companion setup and matching source.

## Keep accessibility evidence separate

A passing tap sequence does not establish useful VoiceOver order, labels, values, actions, large-text layout, keyboard focus, or right-to-left behavior. Audit those journeys on supported destinations. Screenshots can catch appearance drift, but pixels alone do not establish assistive-technology interaction or durable persistence.

Place validation in domain tests, presentation transitions in model/controller tests, and route/control wiring in XCUITest. A layout refactor should not break a behavior test when the visible contract is unchanged.

## Use test plans for matrices

A plan groups configurations, environment settings, language and region choices, repetitions, diagnostics, and target selection. Keep a fast pull-request plan and broader release plan rather than making every developer run every destination.

## Let frameworks coexist

New domain tests can use Swift Testing while XCUITest and performance suites stay in XCTest. Shared production fixtures and helpers should not depend on either framework. Migrate only when readability, diagnostics, parallelism, or maintenance materially improve.

## Validation boundary

The UI journey requires a generated Xcode project, matching scheme, and Simulator destination. It is not marked as executed here.

## Series navigation

- Previous: [Part 71: Swift Testing fundamentals and parameterized tests](../2026-07-19-swift-testing-fundamentals-parameterized-tests/)
- Next: [Part 73: Deterministic dependencies and concurrency tests](../2026-07-19-ios-deterministic-dependencies-concurrency-tests/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Xcode testing](https://developer.apple.com/documentation/xcode/testing) covers XCTest and Xcode test workflows.
- [Organizing tests with test plans](https://developer.apple.com/documentation/xcode/organizing-tests-to-improve-feedback) explains plan configurations and test selection.

## Related topics

- [Xcode, Simulators, devices, and Git](../2026-07-16-xcode-simulators-devices-git/)
- [SwiftUI previews, tests, accessibility, and performance](../2026-07-19-swiftui-previews-testing-ui-accessibility-performance/)
