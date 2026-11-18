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

A reducer makes transitions explicit when event ordering matters. Field Notes uses a small save state machine rather than applying a store framework to every screen.

## Define states before adding effects

```swift
public enum SaveEvent: Sendable { case requested, succeeded, failed }
public enum SaveEffect: Equatable, Sendable { case none, save }
public enum SaveState: Equatable, Sendable {
    case idle, saving, saved, failed

    /// A submitted snapshot cannot accept later edits that dismissal would discard.
    /// Failure restores editing; success stays locked until the editor dismisses.
    public var acceptsInput: Bool { self == .idle || self == .failed }

    public mutating func reduce(_ event: SaveEvent) -> SaveEffect {
        switch (self, event) {
        case (.idle, .requested), (.failed, .requested): self = .saving; return .save
        case (.saving, .succeeded): self = .saved
        case (.saving, .failed): self = .failed
        default: break
        }
        return .none
    }
}
```

The transition table is deliberately small:

| Current state | Event | Next state | Effect |
| --- | --- | --- | --- |
| idle or failed | requested | saving | save |
| saving | requested | saving | none |
| saving | succeeded | saved | none |
| saving | failed | failed | none |
| any other combination | any event | unchanged | none |

The duplicate-request row prevents two submissions from racing. The failed-to-saving row is the retry policy. A terminal saved editor dismisses; opening a different draft creates a new state machine.

## Execute effects at the adapter boundary

The SwiftUI editor copies the submitted draft, asks the reducer for an effect, and awaits the real use case. The UIKit editor follows the same sequence. Both disable submission during the operation and preserve input on failure.

A transition to saved means the repository acknowledged the save. Cancelling a task after that acknowledgement does not undo committed data. If a product needs undo, that is another explicit command, not an assumption about cancellation.

## Test event sequences

`saveTransitions` in `Packages/FieldNotesCore/Tests/FieldNotesCoreTests/RepositoryContractTests.swift` sends request, duplicate request, failure, retry, and success. It checks both the returned effect and the next state.

Run `./scripts/test-package.sh` from `companion/field-notes`. These reducer and repository tests passed on Swift 6.3.3. The model does not prove UIKit event delivery or SwiftUI control behavior.

## Stop before ceremony

A direct function is clearer when an operation has no durable event ordering or competing effects. Add explicit state when it prevents a reachable contradiction, such as two saves or a success label after failure. Do not build a global action bus just to toggle a local disclosure.

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
