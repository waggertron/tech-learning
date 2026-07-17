# Post 16 Evidence: Protocols, Extensions, and Protocol-Oriented Design

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-protocols-extensions-protocol-oriented-design.mdx`
- `src/content/docs/posts/2026-07-16-swift-protocols-extensions-protocol-oriented-design.swift`

## Verified

- Apple Swift 6.3.2 compiled the standard-library source in Swift 6 language mode with warnings treated as errors.
- A fixed clock satisfied the protocol and produced an exact stamped-note instant.
- A protocol extension supplied shared elapsed-time behavior, including the documented future-time clamp.
- An offset clock composed an existential base, a generic function preserved its concrete clock type, and a heterogeneous existential array dispatched both implementations.
- The exact five-line output matched the published checkpoint.

## Boundary

The runnable checkpoint uses the Swift standard library and fits the browser runner contract. Local host compilation does not prove the pinned Linux executor, Foundation `Date`, wall-clock accuracy, SwiftUI environment injection, UIKit delegates, Objective-C interoperability, Simulator, signing, entitlements, or device behavior.

## Not verified

- The pinned browser baseline is Swift 6.3.3 on Linux. This host has Apple Swift 6.3.2 through Command Line Tools.
- The complete browser and Docker executor path was not rerun for this content-only checkpoint.
- Full Xcode, an iOS SDK app target, Simulator, and physical-device behavior remain Not verified.
