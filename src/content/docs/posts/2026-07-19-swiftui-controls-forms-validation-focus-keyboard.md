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

An editor changes a draft until persistence acknowledges Save. Cancel must leave the committed note unchanged, and a failed write must leave text available for retry.

## Use the same draft as the application

`NoteDraft` comes from `FieldNotesCore`. A new instance assigns its stable ID once. An edited instance copies the existing note. The app's `SaveNote` operation validates the title and tags, applies the clock, and writes through `NoteLibrary`.

The complete SwiftUI adapter is `NoteEditorScreen` in `Apps/SwiftUI/FieldNotesSwiftUIApp.swift`:

```swift
struct NoteEditorScreen: View {
    @State var draft: NoteDraft
    let save: (NoteDraft) async throws -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var state = SaveState.idle
    @State private var attemptedSave = false
    @FocusState private var titleFocused: Bool

    var body: some View {
        NavigationStack {
            Form {
                TextField("Title", text: $draft.title).focused($titleFocused)
                if attemptedSave, let error = draft.titleError { Text(error).foregroundStyle(.red) }
                Section("Observation") {
                    TextEditor(text: $draft.body).frame(minHeight: 100).accessibilityLabel("Observation")
                }
                TextField("Tags, separated by commas", text: $draft.tags)
                if attemptedSave, let error = draft.tagsError { Text(error).foregroundStyle(.red) }
                Toggle("Favorite", isOn: $draft.isFavorite)
                if state == .saving { ProgressView("Saving note") }
                if state == .failed { Text("The note was not saved. Your draft is safe. Try Save again.").foregroundStyle(.red) }
            }
            .disabled(!state.acceptsInput)
            .navigationTitle(draft.createdAt == nil ? "New Note" : "Edit Note")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() }.disabled(!state.acceptsInput) }
                ToolbarItem(placement: .confirmationAction) { Button("Save", action: submit).disabled(!state.acceptsInput) }
            }
            .interactiveDismissDisabled(!state.acceptsInput)
        }
    }

    private func submit() {
        attemptedSave = true
        guard draft.canSave else { titleFocused = true; return }
        guard state.reduce(.requested) == .save else { return }
        let submitted = draft
        Task {
            do { try await save(submitted); _ = state.reduce(.succeeded); dismiss() }
            catch { _ = state.reduce(.failed) }
        }
    }
}
```

The title error appears only after an attempted submission. Focus moves to the invalid title. The observation uses a native text editor; tags and favorite state stay editable values in the draft.

## Do not dismiss before acknowledgement

The task calls `save(submitted)` before dismissing. On failure, the reducer becomes failed and the draft remains in state. The same Save button retries the same ID. The entire form, toolbar, and interactive sheet dismissal are disabled during a write so a second action cannot race the in-flight submission.

This is not draft restoration. Cancelling or terminating before a successful save can discard unsaved input. The capstone promises committed-note persistence and explicitly leaves draft restoration outside its slice.

## Test through a reachable failure

Both UI suites start a separate store with `--fail-first-save`. Their journey enters a title, attempts Save, checks the visible failure and retained title, retries, and checks that one row appears. Another journey attempts a blank title before saving valid input.

The package save/reducer contracts passed. UI-test source and app source passed syntax parsing, but the tests have not run in Xcode. Keyboard geometry, focus announcement, large-text layout, and Simulator interaction remain unverified.

## Series navigation

- Previous: [Part 33: SwiftUI layout, safe areas, stacks, grids, and custom layout](../2026-07-19-swiftui-layout-safe-areas-stacks-grids-custom-layout/)
- Next: [Part 35: SwiftUI state, bindings, source of truth, and identity](../2026-07-19-swiftui-state-bindings-source-truth-identity/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [TextField](https://developer.apple.com/documentation/swiftui/textfield) defines editable text input.
- [FocusState](https://developer.apple.com/documentation/swiftui/focusstate) connects focus to state.
- [Form](https://developer.apple.com/documentation/swiftui/form) groups platform-adaptive data-entry controls.
