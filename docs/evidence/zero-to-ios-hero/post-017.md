# Post 17 Evidence: Errors, Result, Throwing APIs, and Recovery

Date: 2026-07-17

## Published artifacts

- `src/content/docs/posts/2026-07-17-swift-errors-result-throwing-recovery.mdx`
- `src/content/docs/posts/2026-07-17-swift-errors-result-throwing-recovery.swift`

## Verified

- Apple Swift 6.3.2 compiled the standard-library source in Swift 6 language mode with warnings treated as errors.
- The executable produced the exact six-line checkpoint output published in the post.
- Assertions passed for valid decoding, invalid identifier context, transport mapping, `Result` transformation, and recovery selection.

## Boundary

The runnable checkpoint uses the Swift standard library and fits the browser runner contract. Local host compilation does not prove the pinned Linux executor, file access, `NSError` bridging, `LocalizedError`, URL loading, Foundation decoding, interface presentation, Simulator, signing, entitlements, or device behavior.

## Not verified

- The pinned browser baseline is Swift 6.3.3 on Linux. This host has Apple Swift 6.3.2 through Command Line Tools.
- The complete browser and Docker executor path has not been rerun for this content-only checkpoint.
- Full Xcode, an iOS SDK app target, Simulator, and physical-device behavior remain Not verified.
