# Post 12 Evidence: Enumerations, Associated Values, and Pattern Matching

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-enumerations-associated-values-pattern-matching.mdx`
- `src/content/docs/posts/2026-07-16-swift-enumerations-associated-values-pattern-matching.swift`

## Verified

- Apple Swift 6.3.2 compiled the standard-library source in Swift 6 language mode with warnings treated as errors.
- The executable constructed idle, loading, loaded, and failed values with case-specific associated data.
- An exhaustive switch extracted each payload, including an empty-notes `where` branch and separate retryable failure patterns.
- An `if case` check proved the retry decision for the failed state.
- The exact five-line output matched the published checkpoint.

## Boundary

The runnable checkpoint uses the Swift standard library and fits the browser runner contract. Local host compilation does not prove the pinned Linux executor, networking, observation, an iOS app, SwiftUI, UIKit, Simulator, signing, entitlements, or device behavior.

## Not verified

- The pinned browser baseline is Swift 6.3.3 on Linux. This host has Apple Swift 6.3.2 through Command Line Tools.
- The complete browser and Docker executor path was not rerun for this content-only checkpoint.
- Full Xcode, an iOS SDK app target, Simulator, and physical-device behavior remain Not verified.
