# Post 1 Evidence: The Apple Development Map

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-apple-development-map.mdx`
- `src/content/docs/posts/2026-07-16-apple-development-map.swift`

## Verified

- Apple Swift 6.3.2 compiled the standalone source in Swift 6 language mode with warnings treated as errors.
- The resulting executable exited successfully and printed `Hello, Apple platforms`.
- The site build emitted `dist/posts/2026-07-16-apple-development-map/index.html`.
- The post labels browser execution as Swift 6.3.3 on Linux and does not present that surface as Apple SDK evidence.

## Not verified

- The pinned stable authoring baseline is Swift 6.3.3. This host has Apple Swift 6.3.2 through Command Line Tools.
- The post's browser editor was not exercised through the complete browser and Docker path in this batch.
- Xcode, Apple SDK, Simulator, signing, archive, and device behavior are not claims made by the code anchor.

