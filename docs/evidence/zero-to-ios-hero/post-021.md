# Post 21 Evidence: Actors, Global Actors, Sendable, and Data Isolation

Date: 2026-07-19

## Published artifacts

- `src/content/docs/posts/2026-07-18-swift-actors-global-actors-sendable-data-isolation.mdx`
- `src/content/docs/posts/2026-07-18-swift-actors-global-actors-sendable-data-isolation.swift`

## Verified

- Apple Swift 6.3.2 compiled the source in Swift 6 mode with complete strict concurrency checking and warnings treated as errors.
- The executable produced the exact two-line output published in the post.
- Assertions proved maximum-revision bookkeeping and main-actor status mutation.

## Boundary

The checkpoint fits the Swift 6.3.3 Linux standard-library runner contract. SwiftUI observation, UIKit, Simulator scheduling, and physical-device behavior remain Not verified.
