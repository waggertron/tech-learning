---
title: UIKit observation, concurrency, networking, and persistence
description: "Bind observable presentation state to UIKit with cancellable tasks, explicit main-actor rendering, and injected network and storage boundaries."
date: 2026-07-19
tags: [ios, swift, uikit, observation, concurrency]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-observation-concurrency-networking-persistence/
series:
  slug: zero-to-ios-hero
  order: 56
---

UIKit does not require tangled callbacks. An observable presentation model can expose one state, while a controller owns observation lifetime and converts state into imperative rendering.

## Keep UI state on the main actor

```swift
@MainActor
@Observable
final class NoteListModel {
    private let library: NoteLibrary
    private(set) var state: LoadState<[FieldNote]> = .idle

    func load() async {
        state = .loading(previous: state.value)
        do { state = .loaded(try await library.notes()) }
        catch is CancellationError { return }
        catch { state = .failed("Notes unavailable", previous: state.value) }
    }
}
```

The library hides persistence and network adapters. The controller never builds SQL, HTTP requests, or file paths.

## Own task and observation lifetime

```swift
private var loadTask: Task<Void, Never>?

override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    loadTask = Task { await model.load() }
}

deinit { loadTask?.cancel() }
```

Production code also avoids duplicate loads and cancels when represented input changes. Long-lived callbacks capture controllers weakly unless ownership is intentional.

## Render snapshots on the main actor

Decode and transform large payloads away from the UI actor when safe. Return sendable values, then update model state and apply collection snapshots on the main actor. Cancellation blocks stale results from replacing newer data.

## Preserve useful state

First load, refresh with previous content, offline content, error, permission denial, and empty results render differently. Persistence errors preserve the draft or previous list when possible.

## Validation boundary

Observation wiring, actor behavior, task cancellation, URLSession, persistence, collection snapshots, and lifecycle integration remain Not verified.

## Series navigation

- Previous: [Part 55: UIKit scrolling, drawing, layers, animation, and haptics](../2026-07-19-uikit-scrolling-drawing-layers-animation-haptics/)
- Next: [Part 57: UIKit traits, accessibility, localization, and restoration](../2026-07-19-uikit-traits-appearance-accessibility-localization-restoration/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Observation](https://developer.apple.com/documentation/observation) defines observable model tracking.
- [URLSession](https://developer.apple.com/documentation/foundation/urlsession) provides networking.
- [MainActor](https://developer.apple.com/documentation/swift/mainactor) isolates UI-facing state.

## Related topics

- [SwiftUI Observation, environment, and dependency flow](../2026-07-19-swiftui-observation-environment-dependency-flow/)
- [Async and await, tasks, groups, cancellation, and continuations](../2026-07-18-swift-async-await-tasks-groups-cancellation-continuations/)
