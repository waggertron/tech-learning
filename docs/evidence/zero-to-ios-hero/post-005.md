# Post 5 Evidence: Operators, Conversion, and Overflow

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-operators-conversion-overflow.mdx`
- `src/content/docs/posts/2026-07-16-swift-operators-conversion-overflow.swift`

## Verified

- Apple Swift 6.3.2 compiled the standalone source in Swift 6 language mode with warnings treated as errors.
- The executable exited successfully with `Relevance: 51/100` and the deliberate wrapping result `UInt8.max &+ 1: 0`.
- The calculation converts integer tag points to `Double`, rounds, clamps to `0...100`, and converts only the bounded result to `UInt8`.
- Published-content validation passed for the expanded series.

## Not verified

- The pinned stable authoring baseline is Swift 6.3.3. This host has Apple Swift 6.3.2 through Command Line Tools.
- The post's editor has not yet been exercised through the complete browser and Docker execution path.
- Apple SDK, Xcode, Simulator, signing, and device behavior are outside this standard-library code anchor.

