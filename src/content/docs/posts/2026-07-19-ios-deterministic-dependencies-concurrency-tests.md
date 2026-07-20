---
title: Deterministic dependencies and concurrency tests
description: "Control clocks, identifiers, randomness, event streams, and cancellation so concurrency tests observe behavior instead of scheduler luck."
date: 2026-07-19
tags: [ios, swift, testing, concurrency, determinism, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-deterministic-dependencies-concurrency-tests/
series:
  slug: zero-to-ios-hero
  order: 74
---

A deterministic test controls the inputs that decide behavior. Wall-clock time, random identifiers, task scheduling, global state, and live network responses are inputs even when they are not ordinary function parameters.

## Inject decisions, not delays

```swift
struct TestClock {
    private(set) var now: Duration = .zero
    mutating func advance(by duration: Duration) { now += duration }
}

struct IDSequence {
    private var values: [UUID]

    mutating func next() -> UUID {
        precondition(!values.isEmpty, "Test requested an unexpected identifier")
        return values.removeFirst()
    }
}
```

Production can use Swift's clock APIs and `UUID.init`; tests supply values deliberately. A production interface should preserve the behavior needed for timeouts and suspension rather than exposing only a timestamp if the use case sleeps.

## Observe protocol events

For an async sequence, the test controls when elements arrive and when the sequence finishes. For cancellation, start the operation, wait until a recording dependency reports entry, cancel the parent task, then assert cleanup and no later write. This creates happens-before relationships without guessing how long a task needs.

## Test actors through behavior

Do not assert executor threads or scheduling order that Swift does not promise. Send concurrent operations, await completion, and assert the actor's observable invariant. If exact event order is a product requirement, encode ordering in the actor's state machine and test that policy.

Unsupported fake operations should fail loudly. A fake that silently ignores invalid states can make tests greener than production.

## Series navigation

- Previous: [Part 73: XCTest, XCUITest, test plans, and framework coexistence](../2026-07-19-ios-xctest-xcuitest-test-plans-coexistence/)
- Next: [Part 75: SwiftUI, UIKit, navigation, accessibility, and UI behavior tests](../2026-07-19-ios-swiftui-uikit-navigation-accessibility-ui-tests/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Swift concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/) defines task, actor, cancellation, and sendability semantics.
- [Clock](https://developer.apple.com/documentation/swift/clock) describes Swift's time and suspension abstraction.

## Related topics

- [Swift async and structured concurrency](../2026-07-18-swift-async-await-tasks-groups-cancellation-continuations/)
- [Concurrency architecture, isolation, cancellation, and lifecycle](../2026-07-19-ios-concurrency-architecture-isolation-cancellation-lifecycle/)
