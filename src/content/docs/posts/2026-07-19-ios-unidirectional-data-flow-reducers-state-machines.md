---
title: Unidirectional data flow, reducers, and state machines
description: "Make editing and synchronization transitions explicit with state, events, pure reducers, and controlled effects."
date: 2026-07-19
tags: [ios, swift, architecture, state-machine, reducers, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-unidirectional-data-flow-reducers-state-machines/
series:
  slug: zero-to-ios-hero
  order: 62
---

Unidirectional data flow is valuable when several events can move one feature through interacting states. State describes what is true, an event describes what happened, and a reducer chooses the next state plus any requested effect.

## Make illegal transitions visible

```swift
enum SyncState: Equatable {
    case idle
    case syncing(pending: Int)
    case offline(pending: Int)
    case failed(pending: Int)
}

enum SyncEvent {
    case requested(pending: Int)
    case networkUnavailable
    case uploadCompleted(remaining: Int)
    case uploadFailed
}

enum SyncEffect: Equatable { case uploadNext }

func reduce(_ state: SyncState, _ event: SyncEvent) -> (SyncState, [SyncEffect]) {
    switch (state, event) {
    case (_, .requested(let count)) where count > 0:
        return (.syncing(pending: count), [.uploadNext])
    case (.syncing(let count), .networkUnavailable):
        return (.offline(pending: count), [])
    case (.syncing, .uploadCompleted(let remaining)) where remaining > 0:
        return (.syncing(pending: remaining), [.uploadNext])
    case (.syncing, .uploadCompleted):
        return (.idle, [])
    case (.syncing(let count), .uploadFailed):
        return (.failed(pending: count), [])
    default:
        return (state, [])
    }
}
```

The reducer performs no upload. An effect handler owns that external work and sends the result back as another event.

## Test the transition table

Pure transitions make boundary cases cheap to enumerate: zero pending changes, lost connectivity, partial progress, duplicate completion, cancellation, and retry. The tests assert both next state and requested effects.

## Scope state to a feature

One global state tree can turn unrelated changes into broad observation and coordination. Field Notes can use a reducer for synchronization while keeping simple view-local focus and disclosure state in the UI. Choose the model per pressure.

## Series navigation

- Previous: [Part 61: MVVM and presentation models](../2026-07-19-ios-mvvm-presentation-models/)
- Next: [Part 63: Domain models, value objects, invariants, and use cases](../2026-07-19-ios-domain-models-value-objects-invariants-use-cases/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Enumerations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/) support exhaustive state and event modeling.
- [Concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/) covers the asynchronous work that effect handlers coordinate.

## Related topics

- [Swift enumerations and pattern matching](../2026-07-16-swift-enumerations-associated-values-pattern-matching/)
- [SwiftUI state, bindings, source of truth, and identity](../2026-07-19-swiftui-state-bindings-source-truth-identity/)
