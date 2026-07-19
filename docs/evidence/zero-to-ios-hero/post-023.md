# Post 23 Evidence: Modules, Packages, Access Control, Interoperability, and API Design

Date: 2026-07-19

## Published artifact

- `src/content/docs/posts/2026-07-19-swift-modules-packages-access-control-interoperability-api-design.md`

## Verified

- Apple Swift 6.3.2 built the library, test-support, and CLI products in Swift 6 mode with warnings treated as errors.
- The raw SwiftPM command required an unsandboxed rerun because nested `sandbox-exec` is blocked inside Codex.

## Boundary

The package contains seven Swift Testing checks, but `swift test` failed because this Command Line Tools installation does not provide the `Testing` module. Test execution, Xcode, iOS SDK, Objective-C header generation, mixed-language builds, binary evolution, Simulator, signing, and device behavior remain Not verified.
