# Post 20 Evidence: Async and Await, Tasks, Groups, Cancellation, and Continuations

Date: 2026-07-18

## Published artifacts

- `src/content/docs/posts/2026-07-18-swift-async-await-tasks-groups-cancellation-continuations.mdx`
- `src/content/docs/posts/2026-07-18-swift-async-await-tasks-groups-cancellation-continuations.swift`

## Verified

- Apple Swift 6.3.2 compiled the source in Swift 6 mode with warnings treated as errors.
- The executable produced the exact three-line checkpoint output.
- Assertions covered deterministic task-group results, continuation output, and cancellation.

## Boundary

The standard-library checkpoint fits the Swift 6.3.3 Linux runner contract. URLSession, Photos, SwiftUI task lifetime, background execution, Simulator scheduling, and device energy behavior remain Not verified.
