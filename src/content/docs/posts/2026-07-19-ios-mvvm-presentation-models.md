---
title: MVVM and presentation models
description: "Use a framework-neutral editor presentation model when derived state, commands, and asynchronous work need one testable owner."
date: 2026-07-19
tags: [ios, swift, architecture, mvvm, swiftui, uikit, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-mvvm-presentation-models/
series:
  slug: zero-to-ios-hero
  order: 61
---

A presentation model translates application operations into states the screen can show. It does not become a second repository. The Field Notes implementation uses `NoteListModel` in `Apps/SwiftUI/FieldNotesSwiftUIApp.swift` and the shared `SaveNote` operation.

## Follow the save across the boundary

```text
editable NoteDraft -> SaveState.requested -> SaveNote
                                         -> NoteLibrary.save
                                         -> NoteRepository.save
success -> refresh committed notes -> dismiss editor
failure -> retain draft -> show recovery -> retry with the same note ID
```

`NoteDraft` owns one stable ID from the moment editing starts. A retry sends that identity again. The repository replaces by ID, so it does not append a second note.

## Keep presentation state separate from durable data

The editor uses the actual shared reducer:

```swift
public enum SaveEvent: Sendable { case requested, succeeded, failed }
public enum SaveEffect: Equatable, Sendable { case none, save }
public enum SaveState: Equatable, Sendable {
    case idle, saving, saved, failed

    /// A submitted snapshot cannot accept later edits that dismissal would discard.
    /// Failure restores editing; success stays locked until the editor dismisses.
    public var acceptsInput: Bool { self == .idle || self == .failed }

    public mutating func reduce(_ event: SaveEvent) -> SaveEffect {
        switch (self, event) {
        case (.idle, .requested), (.failed, .requested): self = .saving; return .save
        case (.saving, .succeeded): self = .saved
        case (.saving, .failed): self = .failed
        default: break
        }
        return .none
    }
}
```

`NoteEditorScreen` calls `state.reduce(.requested)` before starting a task. Only `.save` starts work. A second tap while `.saving` returns `.none`. Success dismisses the editor; failure changes the state to `.failed` and leaves every draft field intact.

The reducer does not perform persistence. It returns permission to perform an effect. This makes duplicate submission behavior testable without rendering the view.

## Give the UI model one job

`NoteListModel.save(_:)` calls `SaveNote`, then reloads committed notes. Search derives from the current notes instead of copying them into independently mutable arrays. The model is `@MainActor` and observable because its properties describe UI state. `NoteLibrary` is a `Sendable` struct, not a protocol named differently in each article.

An observable object is useful when several views read changing presentation state. A pure value or a closure is enough when no shared lifetime is needed. MVVM does not require a view model for every label.

## Check the contract

From `companion/field-notes` run:

```bash
./scripts/test-package.sh
```

The package tests cover duplicate requests, failure followed by retry, fixed draft identity/time, save failure preserving input, and both repository implementations. App-target tests cover the observable model separately. The package checks passed with Swift 6.3.3. SwiftUI rendering and UI journeys remain unverified until the Xcode scheme runs.

## Series navigation

- Previous: [Part 60: MVC and controller boundaries](../2026-07-19-ios-mvc-controller-boundaries/)
- Next: [Part 62: Unidirectional data flow, reducers, and state machines](../2026-07-19-ios-unidirectional-data-flow-reducers-state-machines/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SwiftUI model data](https://developer.apple.com/documentation/swiftui/model-data) explains SwiftUI data ownership and observation.
- [MainActor](https://developer.apple.com/documentation/swift/mainactor) defines the global actor used for UI-facing state.

## Related topics

- [SwiftUI Observation and dependency flow](../2026-07-19-swiftui-observation-environment-dependency-flow/)
- [UIKit observation, concurrency, networking, and persistence](../2026-07-19-uikit-observation-concurrency-networking-persistence/)
