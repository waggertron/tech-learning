# Post 9 Evidence: Collections, Sequences, and Cost

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-collections-sequences-cost.mdx`
- `src/content/docs/posts/2026-07-16-swift-collections-sequences-cost.swift`

## Verified

- Apple Swift 6.3.2 compiled the standalone source in Swift 6 language mode with warnings treated as errors.
- The executable built the tag dictionary, printed keys in deterministic sorted order, and returned the expected tag-to-title groups.
- The instrumented eager filter evaluated four notes while the lazy filter evaluated two before finding the same first selected title.
- The first compile exposed that mapping a lazy prefix preserves a lazy sequence type. The example was simplified to compare eager and lazy `first` access directly, preserving the evaluation lesson without hiding materialization.
- Published-content validation passed for the expanded series.

## Not verified

- The pinned stable authoring baseline is Swift 6.3.3. This host has Apple Swift 6.3.2 through Command Line Tools.
- The post's editor has not yet been exercised through the complete browser and Docker execution path.
- Persistence indexes, SwiftUI list identity, Xcode, Simulator, and device memory behavior are outside this standard-library code anchor.

