# Post 15 Evidence: Closures, Function Types, Capture, and Higher-Order Operations

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-closures-function-types-capture-higher-order-operations.mdx`
- `src/content/docs/posts/2026-07-16-swift-closures-function-types-capture-higher-order-operations.swift`

## Verified

- Apple Swift 6.3.2 compiled the standard-library source in Swift 6 language mode with warnings treated as errors.
- The first compile rejected a global stored comparator closure because the top-level binding was main-actor isolated while the global ranking function was nonisolated. The comparator is now a named function with the same callable shape.
- The executable proved that a default capture observed the later minimum-rating value while a capture-list entry retained its creation-time snapshot.
- Filtering, sorting, key-path mapping, reduction, and a returned tag-matcher closure produced the expected deterministic results.
- The exact four-line output matched the published checkpoint.

## Boundary

The runnable checkpoint uses the Swift standard library and fits the browser runner contract. Local host compilation does not prove the pinned Linux executor, `@Sendable` checking, actor isolation, asynchronous callback delivery, ARC leak diagnosis, SwiftUI actions, UIKit target-action behavior, Simulator, signing, entitlements, or device behavior.

## Not verified

- The pinned browser baseline is Swift 6.3.3 on Linux. This host has Apple Swift 6.3.2 through Command Line Tools.
- The complete browser and Docker executor path was not rerun for this content-only checkpoint.
- Full Xcode, an iOS SDK app target, Simulator, and physical-device behavior remain Not verified.
