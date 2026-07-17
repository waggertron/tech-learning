# Field Notes Companion Workspace

This workspace is the code spine for Zero to iOS Hero. It starts with a Swift package that compiles without an iOS runtime, then exposes the same core through separate SwiftUI and UIKit application targets.

The current app targets are intentionally small workspace proofs. They load the shared in-memory repository and render loading, empty, content, and failure states. Product acceptance grows at the post checkpoints recorded in `docs/field-notes-acceptance-specification.md`.

## Boundaries

```text
Apps/SwiftUI ─┐
              ├─> Packages/FieldNotesCore
Apps/UIKit ───┘          │
                         v
                 NoteRepository port
                         │
                         v
                InMemoryNoteRepository

Tests ─────────────> FieldNotesTestSupport
```

- `FieldNotesCore` contains domain values, application behavior, and repository contracts.
- `FieldNotesTestSupport` contains deterministic dates, IDs, notes, and failure adapters.
- `FieldNotesCLI` gives early language posts an executable checkpoint.
- `project.yml` declares the two iOS apps, their unit tests, UI tests, and schemes.
- Generated `FieldNotes.xcodeproj` files are disposable and ignored by Git.

Production app targets never depend on `FieldNotesTestSupport`. They begin with a local in-memory adapter and gain production persistence through the same `NoteRepository` contract in later posts.

## Package Validation

From this directory:

```bash
swift package --package-path Packages/FieldNotesCore describe
swift build --package-path Packages/FieldNotesCore
./scripts/test-package.sh
swift run --package-path Packages/FieldNotesCore field-notes
```

These commands prove Swift package behavior only. They do not prove an Apple SDK, iOS app target, simulator, signing, accessibility, performance, or physical-device behavior.

## Xcode Project Generation

The frozen generator baseline is XcodeGen 2.45.4. Install that version, then run:

```bash
xcodegen generate --spec project.yml
```

The supported app baseline is Xcode 26.6, Swift 6.3.3 in Swift 6 language mode, the iOS 26.5 SDK, and an iOS 17.0 deployment floor.

Resolve an installed simulator destination before building:

```bash
xcodebuild -project FieldNotes.xcodeproj -scheme FieldNotesSwiftUI -showdestinations
make build-swiftui DESTINATION='platform=iOS Simulator,name=<installed device>,OS=26.5'
make test-swiftui DESTINATION='platform=iOS Simulator,name=<installed device>,OS=26.5'
make build-uikit DESTINATION='platform=iOS Simulator,name=<installed device>,OS=26.5'
make test-uikit DESTINATION='platform=iOS Simulator,name=<installed device>,OS=26.5'
```

Do not copy the placeholder destination literally. Record the resolved device name, runtime, Xcode version, command, and result in the post evidence.

## Current Evidence

- **Compiled:** shared package and command-line target with local Apple Swift 6.3.2.
- **Package tested:** domain, search, ordering, mutation, deterministic fixture, and failure behavior through Swift Testing. The wrapper supplies the Testing framework and macro-plugin paths omitted by the selected Command Line Tools installation. Full Xcode uses the normal `swift test` path.
- **Not verified:** XcodeGen output, Xcode schemes, iOS SDK compilation, simulator journeys, UI tests, accessibility, performance, signing, archives, and devices. Full Xcode is not installed or selected on the current machine.
