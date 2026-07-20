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

Async interface work needs a lifetime and a visible state model. Starting a request from `body` provides neither.

## Model every reachable state

```swift
enum LoadState<Value> {
    case idle
    case loading(previous: Value?)
    case loaded(Value)
    case failed(message: String, previous: Value?)
}
```

Keeping previous content distinguishes first load from refresh. A failed refresh can show the last weather context with a warning instead of replacing useful data with an empty error screen.

## Put effects behind a contract

```swift
protocol WeatherClient: Sendable {
    func weather(for coordinate: Coordinate) async throws -> WeatherContext
}

@MainActor
@Observable
final class WeatherModel {
    private let client: any WeatherClient
    private(set) var state: LoadState<WeatherContext> = .idle

    init(client: any WeatherClient) {
        self.client = client
    }

    func load(coordinate: Coordinate) async {
        let previous = state.value
        state = .loading(previous: previous)

        do {
            let weather = try await client.weather(for: coordinate)
            try Task.checkCancellation()
            state = .loaded(weather)
        } catch is CancellationError {
            state = previous.map(LoadState.loaded) ?? .idle
        } catch {
            state = .failed(
                message: "Weather is unavailable. Try again.",
                previous: previous
            )
        }
    }
}
```

The UI model owns display state. The client owns request construction, response validation, decoding, status codes, and transport errors. Domain code does not depend on `URLSession`.

## Tie tasks to identity

```swift
WeatherPanel(state: model.state)
    .task(id: note.coordinate) {
        await model.load(coordinate: note.coordinate)
    }
```

When the task ID changes, SwiftUI cancels the prior task and starts work for the new input. Cancellation is cooperative. The client and model must propagate or check it before publishing stale results.

Button-created unstructured tasks need ownership too. Store or otherwise scope them when repeated taps, dismissal, or replacement should cancel previous work.

## Render progress without destroying context

```swift
switch model.state {
case .idle, .loading(previous: nil):
    ProgressView("Loading weather")
case .loading(previous: let weather?):
    WeatherCard(weather: weather).overlay { ProgressView() }
case .loaded(let weather):
    WeatherCard(weather: weather)
case .failed(let message, let previous):
    WeatherFailure(message: message, previous: previous, retry: reload)
}
```

Progress labels, retry actions, offline copy, and preserved content are product behavior. A spinner alone does not explain failure or recovery.

## Treat images as another resource pipeline

`AsyncImage` can cover simple remote presentation, but product requirements often need an injected loader with request deduplication, decoded-image memory limits, disk policy, cancellation, and deterministic test data.

Cache keys should include the resource and relevant transformation. Bound every cache. Define whether stale images may appear offline and how private data is cleared.

Use placeholders with stable layout so image completion does not cause surprising jumps. Supply useful accessibility labels for meaningful images and hide decorative ones.

## Test below the view first

An in-memory weather client can prove:

- successful first load
- refresh preserving old content
- transport and decoding failure
- cancellation before state publication
- a newer coordinate winning over an older request
- retry after failure

UI tests then cover the smaller question: does each state expose the right copy, progress, and action?

## Validation boundary

The code was not compiled with Observation or SwiftUI, and no live service was called. Task lifetime, URLSession behavior, caching, offline behavior, Simulator networking, and image accessibility remain Not verified.

## Series navigation

- Previous: [Part 38: SwiftUI navigation, presentation, alerts, and deep links](../2026-07-19-swiftui-navigation-presentation-alerts-deep-links/)
- Next: [Part 40: SwiftUI with SwiftData, queries, migration, and test stores](../2026-07-19-swiftui-swiftdata-queries-relationships-migration-test-stores/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Task](https://developer.apple.com/documentation/swift/task) describes asynchronous work and cancellation.
- [URLSession](https://developer.apple.com/documentation/foundation/urlsession) provides the Foundation networking boundary.
- [AsyncImage](https://developer.apple.com/documentation/swiftui/asyncimage) loads and displays an image from a URL for simple cases.
