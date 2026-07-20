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

A presentation model earns its place when a screen has derived display state, user commands, and asynchronous work that should behave the same in SwiftUI and UIKit. It is not a mandatory partner for every view.

## Model the editor contract

```swift
@MainActor
final class NoteEditorModel {
    private let saveNote: (NoteDraft) async throws -> Void

    var draft = NoteDraft(title: "", body: "")
    private(set) var phase: Phase = .editing

    enum Phase: Equatable {
        case editing
        case saving
        case failed(String)
        case saved
    }

    init(saveNote: @escaping (NoteDraft) async throws -> Void) {
        self.saveNote = saveNote
    }

    var canSave: Bool {
        !draft.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            && phase != .saving
    }

    func save() async {
        guard canSave else { return }
        phase = .saving
        do {
            try await saveNote(draft)
            phase = .saved
        } catch {
            phase = .failed("The note could not be saved.")
        }
    }
}
```

SwiftUI can observe the model and UIKit can render it after commands. Neither adapter changes the saving policy.

## Keep UI mechanics outside

The model should not import SwiftUI or UIKit to express colors, alerts, navigation controllers, focus bindings, or table cells. It exposes semantic state such as `saving` or `failed`; each UI translates that state into its own presentation.

The model is also not the domain. A title invariant still belongs in a domain value or use case if it must hold for widgets, imports, and background sync.

## Add the boundary selectively

A static row probably needs no model. An editor with validation, autosave, cancellation, and two UI adapters does. Judge the boundary by reduced duplication and easier behavior tests, not by whether the folder tree says MVVM.

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
