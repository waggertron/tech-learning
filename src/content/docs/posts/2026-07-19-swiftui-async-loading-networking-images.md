---
title: SwiftUI async work, loading states, networking, and images
description: "Tie cancellable loading to view identity, preserve useful content during refresh, and keep networking and image caching behind explicit contracts."
date: 2026-07-19
tags: [ios, swift, swiftui, concurrency, networking]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-async-loading-networking-images/
series:
  slug: zero-to-ios-hero
  order: 39
---

Loading needs a lifetime and a result-publication policy. Cancelling an old task is useful, but providers can ignore cancellation. A request token can prevent its eventual result from replacing newer content.

## Preserve useful content while replacing it

The complete framework-neutral implementation lives in `Packages/FieldNotesCore/Sources/FieldNotesCore/ResourceLoader.swift`:

```swift
public enum ResourceState<Value: Sendable>: Sendable {
    case idle
    case loading(previous: Value?)
    case loaded(Value)
    case failed(previous: Value?)

    public var value: Value? {
        switch self {
        case .idle: nil
        case .loading(let value), .failed(let value): value
        case .loaded(let value): value
        }
    }
}

/// Latest request wins even when a provider ignores cancellation.
public actor ResourceLoader<Value: Sendable> {
    public private(set) var state: ResourceState<Value> = .idle
    private var generation = 0
    public init() {}

    public func load(_ fetch: @Sendable () async throws -> Value) async {
        generation += 1
        let request = generation
        let previous = state.value
        state = .loading(previous: previous)
        do {
            let value = try await fetch()
            try Task.checkCancellation()
            guard request == generation else { return }
            state = .loaded(value)
        } catch {
            guard request == generation else { return }
            if error is CancellationError {
                if let previous { state = .loaded(previous) } else { state = .idle }
            } else { state = .failed(previous: previous) }
        }
    }
}
```

Each invocation captures a generation before suspension. A result publishes only if that generation is still current. Cancellation restores the previous content or idle state. A failure retains previous content inside a distinct failed state, so the interface can show stale data and recovery together.

The actor serializes access to state, but it does not hold a lock across `await`. Another call can enter while the old fetch is suspended. That is exactly why the generation check exists.

## Prove the race without sleeping

The package tests use an actor gate with a checked continuation. They start the old request, wait until it reaches the gate, complete a new request, then release the old result. The final value remains the new value.

A second test loads content, forces a failure, then cancels a suspended replacement. The original content remains available. These tests passed with Swift 6.3.3 using `./scripts/test-package.sh` from the companion directory.

## Connect a task at the interface boundary

The actual note list uses `.task { await model.load() }` and `.refreshable { await model.load() }`. `NoteListModel.load()` coalesces duplicate requests and checks cancellation before publishing repository data. It keeps previously loaded notes during refresh rather than replacing them with an initial spinner.

`ResourceLoader` is a separate lesson for replaceable inputs such as an image key or coordinate. A SwiftUI adapter would read the actor's state into its main-actor presentation model after awaiting work. It is not itself an observable SwiftUI object.

## Keep transport claims separate

A network client still owns request creation, status-code validation, decoding, and transport errors. An image loader also needs a bounded cache, transformation-aware keys, and a policy for stale/private images. None of those follows automatically from an actor or `AsyncImage`.

The current app intentionally loads local text notes. It does not claim a weather service or image cache. This implementation proves cancellation and result ordering with deterministic values; URLSession, image decoding, offline networking, SwiftUI task delivery, and device behavior remain unverified.

## Series navigation

- Previous: [Part 38: SwiftUI navigation, presentation, alerts, and deep links](../2026-07-19-swiftui-navigation-presentation-alerts-deep-links/)
- Next: [Part 40: SwiftUI with SwiftData, queries, migration, and test stores](../2026-07-19-swiftui-swiftdata-queries-relationships-migration-test-stores/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Task](https://developer.apple.com/documentation/swift/task) describes asynchronous work and cancellation.
- [URLSession](https://developer.apple.com/documentation/foundation/urlsession) provides the Foundation networking boundary.
- [AsyncImage](https://developer.apple.com/documentation/swiftui/asyncimage) loads and displays an image from a URL for simple cases.
