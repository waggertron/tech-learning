---
title: Swift Testing fundamentals and parameterized tests
description: "Express focused Swift behavior with tests, expectations, requirements, tags, traits, arguments, and async confirmations."
date: 2026-07-19
tags: [ios, swift, testing, swift-testing, parameterized-tests, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swift-testing-fundamentals-parameterized-tests/
series:
  slug: zero-to-ios-hero
  order: 72
---

Swift Testing centers each test on behavior rather than a test class lifecycle. `@Test` declares a test, `#expect` records an expectation, and `#require` stops the current test when later checks need a valid value.

## Parameterize a rule

```swift
import Testing
@testable import FieldNotesDomain

@Suite("Tags")
struct TagTests {
    @Test(
        "normalizes valid tags",
        arguments: [
            (" Swift ", "swift"),
            ("iOS", "ios"),
            ("Field Notes", "field notes")
        ]
    )
    func normalizes(input: String, expected: String) throws {
        let tag = try Tag(input)
        #expect(tag.value == expected)
    }
}
```

Use `#require` when later assertions need a non-optional value, such as the first matching note from a search result. The test syntax should follow the production contract instead of distorting it.

## Keep cases focused

Arguments are useful when one behavior repeats across inputs. Separate valid normalization, length boundaries, and invalid input so a failure names the broken rule. Tags can group slow, database, or network tests; traits can control conditions and execution behavior.

## Test asynchronous events

Async tests can await use cases directly. Confirmations are useful for callback-style events when the expected count matters. Avoid sleeping or broad timeouts as synchronization. Inject the dependency that determines completion and await its observable result.

Swift Testing and XCTest can coexist in one project. Choose by capability, not by a forced all-at-once migration.

## Validation boundary

The sample uses Apple Swift Testing syntax but was not compiled in this content batch. The existing Field Notes companion package remains the executable testing checkpoint.

## Series navigation

- Previous: [Part 71: Testing strategy, seams, and confidence](../2026-07-19-ios-testing-strategy-seams-confidence/)
- Next: [Part 73: XCTest, XCUITest, test plans, and framework coexistence](../2026-07-19-ios-xctest-xcuitest-test-plans-coexistence/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Swift Testing](https://developer.apple.com/documentation/testing) documents tests, suites, traits, expectations, and parameterization.
- [Testing Swift packages](https://www.swift.org/documentation/package-manager/) covers SwiftPM test targets and commands.

## Related topics

- [Swift errors and recovery](../2026-07-17-swift-errors-result-throwing-recovery/)
- [Testing strategy, seams, and confidence](../2026-07-19-ios-testing-strategy-seams-confidence/)
