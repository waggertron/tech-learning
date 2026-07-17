# Post 4 Evidence: Values, Variables, Types, and Inference

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-values-variables-types-inference.mdx`
- `src/content/docs/posts/2026-07-16-swift-values-variables-types-inference.swift`

## Verified

- Apple Swift 6.3.2 compiled the standalone source in Swift 6 language mode with warnings treated as errors.
- The executable exited successfully and printed the exact title, timestamp, rating, and favorite summary documented by the post.
- The source precondition passed with the rating inside its closed range.
- Published-content validation passed for the expanded series.

## Not verified

- The pinned stable authoring baseline is Swift 6.3.3. This host has Apple Swift 6.3.2 through Command Line Tools.
- The post's editor has not yet been exercised through the complete browser and Docker execution path.
- Apple SDK, Xcode, Simulator, signing, and device behavior are outside this standard-library code anchor.

