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

No single SwiftUI test surface proves the interface. Previews accelerate inspection, unit tests prove rules, UI tests prove wiring, and device measurements prove hardware behavior.

## Preview states, not one ideal record

```swift
#Preview("Load failure") {
    NoteListView(model: .fixture(state: .failed("Disk unavailable")))
}

#Preview("Large text") {
    NoteEditor(draft: .fixture)
        .environment(\.dynamicTypeSize, .accessibility5)
}
```

Useful fixtures cover loading, empty, populated, error, long localization, right-to-left layout, large text, dark appearance, and permission denial. A preview is interactive inspection, not automated passing evidence.

## Test rules below the view

```swift
import Testing

@Test("Blank titles are rejected")
func blankTitle() {
    let draft = NoteDraft(title: "   ", body: "Observed near creek")
    #expect(draft.titleError == "Enter a title.")
    #expect(!draft.canSave)
}
```

Formatting, validation, filtering, route parsing, and cancellation policy run faster and fail more clearly outside rendered views.

## Keep UI journeys narrow

```swift
func testCreateNote() {
    let app = XCUIApplication()
    app.launchArguments = ["--ui-testing", "--store", "in-memory"]
    app.launch()

    app.buttons["New Note"].tap()
    app.textFields["Title"].typeText("Creek crossing")
    app.buttons["Save"].tap()
    XCTAssertTrue(app.staticTexts["Creek crossing"].waitForExistence(timeout: 2))
}
```

Launch arguments select deterministic local data. UI automation proves the create flow is wired through controls, navigation, and storage. It does not need every validation combination already covered by unit tests.

## Audit accessibility beyond identifiers

Automation identifiers help tests find elements. They do not prove useful VoiceOver order, labels, values, actions, Dynamic Type layout, contrast, reduced motion, keyboard access, Voice Control, or localization. Record those checks separately.

## Measure a budget

Define a user outcome first: launch to usable notes, scroll a seeded collection, open an editor, or save an attachment. Record destination, data size, release configuration, metric, and variance. Simulator timing does not become device performance evidence.

## Validation boundary

The examples did not run under Xcode. Preview rendering, Swift Testing in an app target, XCUITest, accessibility audits, Instruments, Simulator, and device performance remain Not verified.

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
