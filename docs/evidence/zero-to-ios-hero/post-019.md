# Post 19 Evidence: ARC, Ownership, Capture Lists, and Memory Safety

Date: 2026-07-18

## Published artifacts

- `src/content/docs/posts/2026-07-18-swift-arc-ownership-capture-lists-memory-safety.mdx`
- `src/content/docs/posts/2026-07-18-swift-arc-ownership-capture-lists-memory-safety.swift`

## Verified

- Apple Swift 6.3.2 compiled the source in Swift 6 language mode with warnings treated as errors.
- The executable produced the exact three-line output published in the post.
- Assertions proved the strong cycle, explicit edge removal, and weak capture release.
- The published-content validator and site build passed at 640 pages.

## Boundary

The checkpoint fits the Swift 6.3.3 Linux browser contract. It does not prove Xcode memory graphs, Instruments, framework lifecycle, Simulator behavior, or physical-device memory pressure.

## Not verified

- The pinned browser baseline differs from the available Apple Swift 6.3.2 host.
- Full Xcode, Simulator, Instruments, and device behavior remain Not verified.
