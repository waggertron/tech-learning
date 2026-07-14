# Swift and Apple Platform Validation

Use the commands that match the artifact. Record the command, toolchain, destination, result, and any unverified boundary.

## Inspect the Environment

```bash
xcode-select -p
xcodebuild -version
swift --version
xcrun simctl list runtimes
xcrun simctl list devices available
xcodebuild -showdestinations -scheme FieldNotes -project FieldNotes.xcodeproj
```

Command Line Tools can compile pure Swift and packages. They cannot replace a full Xcode installation for iOS SDKs, app schemes, Simulator, signing, archives, or device runs.

## Standalone Swift

```bash
swiftc -swift-version 6 -warnings-as-errors Example.swift -o /tmp/example
/tmp/example
swift Example.swift
```

Use `swiftc` when compilation itself is evidence. Pass the language mode explicitly for standalone examples. Use `swift` for small script-shaped exercises after the same source has a compilation check in automation.

If a managed environment cannot write compiler caches to their defaults, redirect only the caches to a self-cleaning temporary path:

```bash
CLANG_MODULE_CACHE_PATH=/tmp/clang-module-cache \
SWIFT_MODULECACHE_PATH=/tmp/swift-module-cache \
swiftc -swift-version 6 -warnings-as-errors Example.swift -o /tmp/example
```

## Swift Packages

```bash
swift package describe
swift build
swift test
swift test --filter FieldNotesCoreTests
swift test --parallel
```

Add `-Xswiftc -warnings-as-errors` for teaching examples when warnings would indicate stale or unsafe code. Keep package tools and language versions aligned with `supported-matrix.md`.

## Browser Swift Runner

Use the narrowest stable check that matches the change:

```bash
npm run test:swift-runner-contract
npm run test:swift-repl
npm run validate:swift-repl-browser
npm run test:swift-runner-executor
```

The contract and component tests are deterministic, credential-free, and do not require Docker. The browser validator starts an isolated local Astro fixture, checks its HTTP and script surfaces before Chromium, exercises the REPL contract with deterministic responses, and cleans its generated fixture caches.

The executor suite requires a working local Docker daemon. Run it when changing the pinned Swift image, container arguments, resource limits, timeouts, output accounting, source transfer, host isolation, or cleanup. Record this evidence as **Linux runner tested**. It proves the pinned Swift 6.3.3 Linux standard-library boundary, not Apple SDK, simulator, signing, entitlement, or device behavior.

## Xcode Projects and Workspaces

```bash
xcodebuild build \
  -project FieldNotes.xcodeproj \
  -scheme FieldNotes \
  -destination 'platform=iOS Simulator,name=<current iPhone>,OS=26.5' \
  CODE_SIGNING_ALLOWED=NO

xcodebuild test \
  -project FieldNotes.xcodeproj \
  -scheme FieldNotes \
  -testPlan FieldNotes \
  -destination 'platform=iOS Simulator,name=<current iPhone>,OS=26.5' \
  -resultBundlePath /tmp/FieldNotes.xcresult
```

Replace `-project` with `-workspace FieldNotes.xcworkspace` when dependencies or project structure require a workspace. Use names returned by `-showdestinations`. Do not guess a simulator model in durable automation.

## Focused Xcode Tests

```bash
xcodebuild test \
  -project FieldNotes.xcodeproj \
  -scheme FieldNotes \
  -destination 'platform=iOS Simulator,name=<current iPhone>,OS=26.5' \
  -only-testing:FieldNotesTests/NoteEditorTests
```

Use `build-for-testing` followed by `test-without-building` when a matrix reuses the same build products. Preserve `.xcresult` bundles for diagnostics and coverage evidence.

## Physical Devices

List eligible destinations with `xcodebuild -showdestinations`. Device validation requires full Xcode, signing, a development team, a registered device where applicable, and any service-specific entitlement or account setup.

Record manual device evidence with:

- Device class and operating-system version.
- Build commit and Xcode version.
- Capability, account, network, and permission state.
- Steps, expected result, observed result, and cleanup.

Do not place device identifiers, team IDs, signing certificates, tokens, or provisioning data in the repository.

## Evidence Labels

- **Compiled**: Compiler completed successfully for the named target.
- **Package tested**: Swift package tests passed.
- **Linux runner tested**: The browser runner or executor contract passed against the pinned Swift 6.3.3 Linux boundary.
- **Simulator tested**: Named flow passed on the recorded simulator runtime.
- **Device tested**: Named flow passed on recorded physical hardware.
- **Account tested**: Service integration passed with the named sandbox or development service.
- **Not verified**: Required tool, runtime, device, entitlement, account, or network was unavailable.
