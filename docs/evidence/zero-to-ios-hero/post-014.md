# Post 14 Evidence: Properties, Methods, Subscripts, Initialization, and Deinitialization

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-properties-methods-subscripts-initialization-deinitialization.mdx`
- `src/content/docs/posts/2026-07-16-swift-properties-methods-subscripts-initialization-deinitialization.swift`

## Verified

- Apple Swift 6.3.2 compiled the standard-library source in Swift 6 language mode with warnings treated as errors.
- The failable initializer normalized case and whitespace, enforced length and character rules, and rejected blank and punctuated inputs.
- Computed properties, a prefix method, and the optional integer-offset subscript returned the published values without treating a Swift string as byte-indexed storage.
- A scoped class instance remained alive through `withExtendedLifetime` and printed its cleanup line from `deinit` after the lease scope ended.
- The exact seven-line output matched the published checkpoint.

## Boundary

The runnable checkpoint uses the Swift standard library and fits the browser runner contract. Local host compilation does not prove the pinned Linux executor, concurrent lazy-property behavior, SwiftUI property wrappers, observation, UIKit lifecycle callbacks, persistence, Simulator, signing, entitlements, or device behavior.

## Not verified

- The pinned browser baseline is Swift 6.3.3 on Linux. This host has Apple Swift 6.3.2 through Command Line Tools.
- The complete browser and Docker executor path was not rerun for this content-only checkpoint.
- Full Xcode, an iOS SDK app target, Simulator, and physical-device behavior remain Not verified.
