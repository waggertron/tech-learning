# Apple Source Research Reference

Reviewed on 2026-07-13. Use for claims about current APIs, framework direction, toolchains, platform support, design, privacy, signing, entitlements, review, and distribution.

## Source Order

1. Apple Developer Documentation for framework and API contracts.
2. The Swift book, Swift.org release posts, Swift Evolution proposals, and package documentation for language and toolchain behavior.
3. Xcode release notes and Xcode support tables for compiler, SDK, deployment, device, and simulator ranges.
4. Human Interface Guidelines and accessibility documentation for interaction and platform conventions.
5. App Store Connect Help, submission requirements, and App Review Guidelines for distribution rules.
6. WWDC sessions for mental models and migration guidance. Verify lasting API claims against current documentation.
7. Apple sample code for complete integration patterns. Check its last update and deployment targets.

Use third-party material to discover questions or compare practice, not as the final authority for an Apple contract when a primary source exists.

## Refresh Workflow

1. Classify each claim as stable language behavior, versioned API behavior, toolchain behavior, design guidance, or policy.
2. Search the primary source family for the focused page.
3. Check availability, beta labels, required capabilities, supported platforms, and the page or release date.
4. Compare the stable release with any beta material. Keep beta APIs out of the baseline.
5. Record the review date in version-sensitive reference files.
6. Link the focused source next to the supported claim in published content.
7. Recheck before publication and whenever stable Xcode changes.

## Source Quality Checks

- Prefer a symbol, article, release note, or requirement page over a documentation landing page.
- Distinguish a framework's availability from a specific symbol's availability.
- Do not infer device support from simulator support or submission support from deployment support.
- Treat search snippets as discovery only. Open the source before relying on it.
- Avoid citing a beta page as the stable contract.
- Synthesize several pages from the same source family into one explanation when they support one argument.

## Current Baseline Sources

- [Xcode support matrix](https://developer.apple.com/support/xcode/)
- [Xcode 26.6 release notes](https://developer.apple.com/documentation/xcode-release-notes/xcode-26_6-release-notes)
- [Swift 6.3 release](https://www.swift.org/blog/swift-6.3-released/)
- [Swift 6.3.3 announcement](https://forums.swift.org/t/announcing-swift-6-3-3/87888)
- [App Store submission requirements](https://developer.apple.com/app-store/submitting/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
