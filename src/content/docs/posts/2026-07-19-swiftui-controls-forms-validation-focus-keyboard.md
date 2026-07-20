---
title: SwiftUI controls, forms, validation, focus, and keyboards
description: "Build a draft-based note editor with native controls, focused fields, validation, submit behavior, and unsaved-change handling."
date: 2026-07-19
tags: [ios, swift, swiftui, forms, accessibility]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-controls-forms-validation-focus-keyboard/
series:
  slug: zero-to-ios-hero
  order: 34
---

An editor needs a temporary draft. Writing each keystroke directly into the persisted note makes Cancel dishonest and exposes half-valid data to the rest of the app.

## Give the draft an explicit shape

```swift
struct NoteDraft: Equatable {
    var title = ""
    var body = ""
    var isFavorite = false

    var trimmedTitle: String {
        title.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    var titleError: String? {
        trimmedTitle.isEmpty ? "Enter a title." : nil
    }

    var canSave: Bool { titleError == nil }
}
```

The draft holds editable input. Conversion to a durable domain command happens only after validation succeeds.

## Build from native controls

```swift
struct NoteEditor: View {
    enum Field: Hashable { case title, body }

    @State private var draft: NoteDraft
    @State private var attemptedSave = false
    @FocusState private var focusedField: Field?

    let original: NoteDraft
    let save: (NoteDraft) async throws -> Void

    init(note: FieldNote, save: @escaping (NoteDraft) async throws -> Void) {
        let draft = NoteDraft(title: note.title, body: note.body,
                              isFavorite: note.isFavorite)
        _draft = State(initialValue: draft)
        original = draft
        self.save = save
    }

    var body: some View {
        Form {
            Section("Note") {
                TextField("Title", text: $draft.title)
                    .textInputAutocapitalization(.sentences)
                    .submitLabel(.next)
                    .focused($focusedField, equals: .title)
                    .onSubmit { focusedField = .body }

                TextField("Observation", text: $draft.body, axis: .vertical)
                    .lineLimit(4...12)
                    .focused($focusedField, equals: .body)

                if attemptedSave, let error = draft.titleError {
                    Text(error).foregroundStyle(.red)
                }
            }

            Toggle("Favorite", isOn: $draft.isFavorite)
        }
    }
}
```

Labels stay visible and match Voice Control names. Input traits are hints, not validation. Pasted text, hardware keyboards, dictation, and automation can bypass the onscreen keyboard.

## Validate at the action boundary

```swift
private func submit() {
    attemptedSave = true

    guard draft.canSave else {
        focusedField = .title
        return
    }

    Task {
        try await save(draft)
    }
}
```

Disable Save when that communicates readiness, but keep an accessible explanation near invalid input. Validation during typing can be useful when it helps correction. Do not announce an error before a person has had a reasonable chance to enter a value.

Async save needs explicit progress, success, and failure state. Part 39 supplies that complete state machine.

## Preserve the unsaved-change contract

```swift
private var hasUnsavedChanges: Bool {
    draft != original
}
```

Cancel can dismiss immediately when the draft is unchanged. Otherwise present a choice to keep editing or discard the draft. Interactive dismissal needs the same policy, not a separate loophole.

The persisted note remains unchanged until Save succeeds. If saving fails, the draft stays on screen with recovery guidance.

## Treat focus as state, not storage

Focus identifies the current interaction target. It can change because of touch, keyboard traversal, validation recovery, navigation, or system behavior. Avoid using focus as the source of truth for whether content is valid or saved.

For iPad and Mac-style input, pair field traversal with visible commands. A keyboard shortcut must invoke the same save action and validation path as the toolbar button.

## Test complete form states

- new blank draft
- valid title and multiline body
- validation failure and focus recovery
- save in progress and repeated-submit prevention
- save failure with text preserved
- unchanged and changed cancellation
- largest Dynamic Type sizes
- hardware keyboard traversal and shortcuts
- VoiceOver order and error announcement

## Validation boundary

These examples were reviewed but not compiled or exercised with a software or hardware keyboard. Xcode, Apple SDK, Simulator, focus movement, dismissal, VoiceOver, and Dynamic Type behavior remain Not verified.

## Series navigation

- Previous: [Part 33: SwiftUI layout, safe areas, stacks, grids, and custom layout](../2026-07-19-swiftui-layout-safe-areas-stacks-grids-custom-layout/)
- Next: [Part 35: SwiftUI state, bindings, source of truth, and identity](../2026-07-19-swiftui-state-bindings-source-truth-identity/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [TextField](https://developer.apple.com/documentation/swiftui/textfield) defines editable text input.
- [FocusState](https://developer.apple.com/documentation/swiftui/focusstate) connects focus to state.
- [Form](https://developer.apple.com/documentation/swiftui/form) groups platform-adaptive data-entry controls.
