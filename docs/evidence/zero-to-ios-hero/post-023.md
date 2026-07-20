# Post 23 Evidence: Modules, Packages, Access Control, Interoperability, and API Design

Date: 2026-07-19

## Published artifact

- `src/content/docs/posts/2026-07-19-swift-modules-packages-access-control-interoperability-api-design.md`

## Verified

- Apple Swift 6.3.2 built the library, test-support, and CLI products in Swift 6 mode with warnings treated as errors.
- `companion/field-notes/scripts/test-package.sh` supplied the Command Line Tools `Testing` framework, macro-plugin, and linker paths.
- All seven Swift Testing checks passed through the wrapper outside the Codex managed sandbox.
- The sandboxed wrapper failed with SwiftPM manifest and module-cache permission errors, while the same wrapper passed unsandboxed. This isolates the failure to the agent environment.

## Boundary

Raw `swift test` does not discover the Command Line Tools `Testing` paths for this package. Xcode, iOS SDK, Objective-C header generation, mixed-language builds, binary evolution, Simulator, signing, and device behavior remain Not verified.
