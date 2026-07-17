# Post 13 Evidence: Classes, Identity, Inheritance, and Type Casting

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-classes-identity-inheritance-type-casting.mdx`
- `src/content/docs/posts/2026-07-16-swift-classes-identity-inheritance-type-casting.swift`

## Verified

- Apple Swift 6.3.2 compiled the standard-library source in Swift 6 language mode with warnings treated as errors.
- The executable proved that an assigned class reference shares one instance while a separately initialized object has independent identity.
- Mutation through the alias was visible through the original reference.
- A superclass reference retained a `SharedEditingSession` dynamic type, dispatched its overridden method, and conditionally downcast with `as?`.
- The exact four-line output matched the published checkpoint.

## Boundary

The runnable checkpoint uses the Swift standard library and fits the browser runner contract. Local host compilation does not prove the pinned Linux executor, ARC cycle diagnosis, Objective-C interoperability, an iOS app, SwiftUI, UIKit, Simulator, signing, entitlements, or device behavior.

## Not verified

- The pinned browser baseline is Swift 6.3.3 on Linux. This host has Apple Swift 6.3.2 through Command Line Tools.
- The complete browser and Docker executor path was not rerun for this content-only checkpoint.
- Full Xcode, an iOS SDK app target, Simulator, and physical-device behavior remain Not verified.
