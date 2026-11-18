# Field Notes Companion Workspace

This workspace is the code spine for Zero to iOS Hero. It starts with a Swift package that compiles without an iOS runtime, then exposes the same core through separate SwiftUI and UIKit application targets.

The app sources now implement the bounded text-note path: list, detail, create/edit drafts, validation, failure/retry, search, favorite, delete confirmation, and committed data across relaunch. Both apps select the file adapter at startup. These Apple targets have not been built or run because full Xcode is unavailable. Product acceptance is recorded in `docs/field-notes-acceptance-specification.md`.

## Boundaries

```text
Apps/SwiftUI ─┐
              ├─> Packages/FieldNotesCore
Apps/UIKit ───┘          │
                         v
                 NoteRepository port
                         │
                         v
                InMemoryNoteRepository or FileNoteRepository

Tests ─────────────> FieldNotesTestSupport
```

- `FieldNotesCore` contains domain values, application behavior, and repository contracts.
- `FieldNotesTestSupport` contains deterministic dates, IDs, notes, and failure adapters.
- `FieldNotesCLI` gives early language posts an executable checkpoint.
- `project.yml` declares the two iOS apps, their unit tests, UI tests, and schemes.
- Generated `FieldNotes.xcodeproj` files are disposable and ignored by Git.

Production app targets never depend on `FieldNotesTestSupport`. They use one application-owned `FileNoteRepository` actor. Tests can substitute the memory implementation through the same contract. Separate processes or multiple live file actors require coordination outside this specimen.

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

- **Compiled:** shared package and command-line target with local Apple Swift 6.3.3.
- **Package tested:** shared memory/file behavior, reopen, invalid store preservation, failed-write preservation, domain values, draft save identity/time, save reducer, cancellation/latest-request ordering, and pure tag geometry through Swift Testing. The wrapper supplies the Testing framework and macro-plugin paths omitted by the selected Command Line Tools installation. Full Xcode uses the normal `swift test` path.
- **Not verified:** XcodeGen output, Xcode schemes, iOS SDK compilation, simulator journeys, UI tests, accessibility, performance, signing, archives, and devices. Full Xcode is not installed or selected on the current machine.

## Reproduce the local product journeys

Debug builds accept `--ui-testing --store-name create-edit --reset-store` for an isolated empty file. The name permits only letters, digits, and hyphens. Relaunch the same store without `--reset-store` to check persistence. Add `--fail-first-save` to reject the first write, retain the draft, then retry against the actual file adapter. Production startup ignores those test switches.

The two UI suites contain create/edit/relaunch and failed-save/retry journeys. They are source-level acceptance drivers until the matching Xcode test scheme runs. Syntax parsing does not establish API availability or behavior.

`Apps/SwiftUI/NoteStoreSchema.swift` and `Tests/SwiftUIAppTests/NoteMigrationTests.swift` are a separate SwiftData alternative: version 1 to version 2 adds an optional summary, and a test creates an old store before opening it with the migration plan. The app does not select that store. SwiftData compilation and migration results remain unverified.

## File repository contract

The file format is `{ "version": 1, "notes": [...] }`. Save replaces by stable ID; deleting an absent ID succeeds; the library supplies a deterministic order. Decoding rechecks note invariants and rejects duplicate stored IDs. Missing files mean an empty library. Corrupt, unreadable, or unsupported files produce typed errors and are never automatically deleted. Writes use Foundation atomic replacement. The failure contract tests inject a rejected replacement and prove the previous bytes and notes remain readable. Atomic replacement is not a promise of `fsync`, cross-process transactions, or crash/power-loss durability.

A delayed-save UI regression uses `--delay-save --fail-first-save` to hold submission for two seconds, check that editing and dismissal are disabled, then verify that failure restores editing before retry. The package test uses a continuation gate instead of a timer to prove the shared `SaveState.acceptsInput` policy remains locked across an awaited save and unlocks on failure. The UI journeys remain unexecuted without Xcode.
