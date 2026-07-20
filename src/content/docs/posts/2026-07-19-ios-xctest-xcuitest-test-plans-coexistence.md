---
title: XCTest, XCUITest, test plans, and framework coexistence
description: "Keep XCTest where UI automation, performance metrics, existing suites, and Xcode test plans provide unique value alongside Swift Testing."
date: 2026-07-19
tags: [ios, swift, testing, xctest, xcuitest, test-plans, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-xctest-xcuitest-test-plans-coexistence/
series:
  slug: zero-to-ios-hero
  order: 73
---

XCTest remains the right tool for XCUITest interface automation, performance measurement, Objective-C interoperability, and established suites whose rewrite would add cost without stronger evidence.

## Give one UI journey a controlled launch

```swift
final class CreateNoteUITests: XCTestCase {
    func testCreatesNoteFromEmptyLibrary() {
        let app = XCUIApplication()
        app.launchArguments = ["--ui-testing", "--fixture", "empty-library"]
        app.launch()

        app.buttons["New note"].tap()
        app.textFields["Title"].tap()
        app.textFields["Title"].typeText("Trail marker")
        app.buttons["Save"].tap()

        XCTAssertTrue(app.staticTexts["Trail marker"].waitForExistence(timeout: 2))
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
```

The app must interpret test arguments only in a controlled nonproduction path and load deterministic local data. Stable visible labels are preferable selectors; accessibility identifiers help when labels are localized or duplicated.

## Use test plans for matrices

A plan groups configurations, environment settings, language and region choices, repetitions, diagnostics, and target selection. Keep a fast pull-request plan and broader release plan rather than making every developer run every destination.

## Let frameworks coexist

New domain tests can use Swift Testing while XCUITest and performance suites stay in XCTest. Shared production fixtures and helpers should not depend on either framework. Migrate only when readability, diagnostics, parallelism, or maintenance materially improve.

## Validation boundary

The UI journey requires a generated Xcode project, matching scheme, and Simulator destination. It is not marked as executed here.

## Series navigation

- Previous: [Part 72: Swift Testing fundamentals and parameterized tests](../2026-07-19-swift-testing-fundamentals-parameterized-tests/)
- Next: [Part 74: Deterministic dependencies and concurrency tests](../2026-07-19-ios-deterministic-dependencies-concurrency-tests/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Xcode testing](https://developer.apple.com/documentation/xcode/testing) covers XCTest and Xcode test workflows.
- [Organizing tests with test plans](https://developer.apple.com/documentation/xcode/organizing-tests-to-improve-feedback) explains plan configurations and test selection.

## Related topics

- [Xcode, Simulators, devices, and Git](../2026-07-16-xcode-simulators-devices-git/)
- [SwiftUI previews, tests, accessibility, and performance](../2026-07-19-swiftui-previews-testing-ui-accessibility-performance/)
