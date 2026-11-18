---
title: "SwiftUI Field Notes: assemble the local notebook"
description: "Wire the shared note contracts into SwiftUI, exercise failed-save recovery and disk relaunch, and distinguish package proof from pending Apple-target evidence."
date: 2026-07-19
tags: [ios, swift, swiftui, capstone, architecture]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-field-notes-capstone/
series:
  slug: zero-to-ios-hero
  order: 44
---

The capstone is one local product loop: browse, create, validate, save, relaunch, edit, search, favorite, and delete with confirmation. It uses the same tested core through SwiftUI's own interface model.

## Build the layers that exist

```text
SwiftUI controls and navigation
           |
           v
NoteDraft / SaveState / SaveNote
           |
           v
NoteLibrary -> NoteRepository
                    |
          FileNoteRepository actor
                    |
       versioned JSON in Application Support
```

The alternative in-memory adapter exists for tests. SwiftData migration is a separate lesson and is not silently selected by the app. The file repository has one app-owned writer and does not claim multi-process coordination or power-loss durability beyond Foundation's atomic replacement behavior.

## Run the companion

From `companion/field-notes`:

```bash
swift build --package-path Packages/FieldNotesCore
./scripts/test-package.sh
xcodegen generate --spec project.yml
xcodebuild -project FieldNotes.xcodeproj -scheme FieldNotesSwiftUI -showdestinations
```

Choose a destination that the last command actually reports, then pass its exact value as `DESTINATION` to the Makefile:

```bash
make build-swiftui DESTINATION="$FIELD_NOTES_DESTINATION"
make test-swiftui DESTINATION="$FIELD_NOTES_DESTINATION"
```

Set `FIELD_NOTES_DESTINATION` to the selected destination before those commands. The repository does not guess a simulator device name or runtime.

## Follow a failed save

The UI driver starts `--ui-testing --store-name save-failure --reset-store --fail-first-save`. Enter a title and tap Save. The first write fails without touching the file. The editor keeps the title and shows recovery copy. Tap Save again: the same draft ID is committed once, and the list displays one note.

The other journey saves a note, edits its observation, terminates, and launches the same store without resetting it. This distinguishes durable data from an in-memory list that only survives navigation.

## Inspect the source by responsibility

- `Apps/Shared/AppComposition.swift`: production store location and debug-only deterministic startup.
- `Apps/SwiftUI/`: native controls, navigation, state rendering, and event handling.
- `Packages/FieldNotesCore/Sources/FieldNotesCore/NoteDraft.swift`: draft, validated values, save operation, and save reducer.
- `Packages/FieldNotesCore/Sources/FieldNotesCore/adapters/FileNoteRepository.swift`: versioned file I/O and atomic replacement.
- `Tests/SwiftUIUITests/`: the two actual product journeys.

## Completion evidence

| Claim | Current evidence |
| --- | --- |
| package domain, reducer, loader, layout geometry, and both repositories | Swift 6.3.3 package tests passed |
| app and UI-test syntax | `swiftc -frontend -parse` passed |
| Apple SDK compilation and Simulator journeys | not verified, full Xcode unavailable |
| accessibility, signing, archives, and physical devices | not verified |

A syntax parse does not resolve Apple APIs or run a UI test. The capstone's app implementation is inspectable, but its Apple application acceptance remains open.

## Keep the slice bounded

Attachments, location, cloud sync, widgets, multiple independent windows, draft restoration, and other platform integrations are excluded from this release. They need their own product contract and matching evidence before being described as working features.

## Series navigation

- Previous: [Part 43: SwiftUI previews, tests, accessibility, and performance](../2026-07-19-swiftui-previews-testing-ui-accessibility-performance/)
- Next: [Part 45: UIKit's event-driven mental model and app lifecycle](../2026-07-19-uikit-event-driven-mental-model-app-lifecycle/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SwiftUI](https://developer.apple.com/documentation/swiftui/) is the interface framework boundary.
- [SwiftData](https://developer.apple.com/documentation/swiftdata) is the declarative persistence adapter used in this arc.
- [Accessibility](https://developer.apple.com/accessibility/) collects platform design and testing guidance.

## Related topics

- [From app idea to user problem](../2026-07-19-ios-app-idea-user-problem/)
- [Modules, packages, access control, interoperability, and API design](../2026-07-19-swift-modules-packages-access-control-interoperability-api-design/)
