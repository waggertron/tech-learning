# Post 8 Evidence: Optionals and Absence

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-optionals-absence.mdx`
- `src/content/docs/posts/2026-07-16-swift-optionals-absence.swift`

## Verified

- Apple Swift 6.3.2 compiled the standalone source in Swift 6 language mode with warnings treated as errors.
- The executable parsed the valid latitude and longitude, propagated missing input as `nil`, and printed the expected character count and absence label.
- The source exercises optional input and output, `guard` binding, chained member access, nil coalescing, multi-value conversion binding, range validation, and `if let`.
- Published-content validation passed for the expanded series.

## Not verified

- The pinned stable authoring baseline is Swift 6.3.3. This host has Apple Swift 6.3.2 through Command Line Tools.
- The post's editor has not yet been exercised through the complete browser and Docker execution path.
- Core Location, MapKit, Xcode, Simulator, permission, and device behavior are outside this standard-library code anchor.

