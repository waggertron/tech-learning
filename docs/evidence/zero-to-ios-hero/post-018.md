# Post 18 Evidence: Generics, Associated Types, Existentials, and Opaque Types

Date: 2026-07-17

## Published artifacts

- `src/content/docs/posts/2026-07-17-swift-generics-associated-types-existentials-opaque-types.mdx`
- `src/content/docs/posts/2026-07-17-swift-generics-associated-types-existentials-opaque-types.swift`

## Verified

- Apple Swift 6.3.2 compiled the standard-library source in Swift 6 language mode with warnings treated as errors.
- The executable produced the exact five-line checkpoint output published in the post.
- Assertions passed for paging, mapped cursor preservation, constrained generic use, existential dispatch, and opaque return behavior.

## Boundary

The runnable checkpoint uses the Swift standard library and fits the browser runner contract. Local host compilation does not prove SwiftUI `some View`, framework type erasure, Objective-C generics, module resilience, compiler specialization decisions, binary size, Simulator, signing, entitlements, or device behavior.

## Not verified

- The pinned browser baseline is Swift 6.3.3 on Linux. This host has Apple Swift 6.3.2 through Command Line Tools.
- The complete browser and Docker executor path has not been rerun for this content-only checkpoint.
- Full Xcode, an iOS SDK app target, Simulator, and physical-device behavior remain Not verified.
