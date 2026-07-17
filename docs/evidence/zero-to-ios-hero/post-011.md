# Post 11 Evidence: Structures and Value Semantics

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-structures-value-semantics.mdx`
- `src/content/docs/posts/2026-07-16-swift-structures-value-semantics.swift`

## Verified

- Apple Swift 6.3.2 compiled the standard-library source in Swift 6 language mode with warnings treated as errors.
- The executable copied a `FieldNote`, mutated the copy's stored properties and array, and proved that the original remained unchanged.
- A nonmutating transformation returned a renamed copy without changing the receiver.
- The exact output distinguished the original, directly edited copy, and transformed copy.

## Boundary

The runnable checkpoint uses the Swift standard library and fits the browser runner contract. Local host compilation does not prove the pinned Linux executor, an iOS app, SwiftUI, UIKit, Simulator, signing, entitlements, or device behavior.

## Not verified

- The pinned browser baseline is Swift 6.3.3 on Linux. This host has Apple Swift 6.3.2 through Command Line Tools.
- The complete browser and Docker executor path was not rerun for this content-only checkpoint.
- Full Xcode, an iOS SDK app target, Simulator, and physical-device behavior remain Not verified.
