---
title: SwiftUI state, bindings, source of truth, and identity
description: "Place transient UI state at one owner, derive secondary facts, and pass narrow bindings without duplicating truth."
date: 2026-07-19
tags: [ios, swift, swiftui, state, bindings]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-state-bindings-source-truth-identity/
series:
  slug: zero-to-ios-hero
  order: 35
---

Every mutable fact needs one source of truth. SwiftUI wrappers describe ownership and access. They do not make duplicated state synchronize itself.

## Own local state once

```swift
struct NoteEditor: View {
    @State private var draft: NoteDraft

    init(note: FieldNote) {
        _draft = State(initialValue: NoteDraft(note: note))
    }

    var body: some View {
        EditorFields(draft: $draft)
    }
}
```

`NoteEditor` owns the temporary draft for this editor identity. `EditorFields` receives permission to read and mutate that same value:

```swift
struct EditorFields: View {
    @Binding var draft: NoteDraft

    var body: some View {
        TextField("Title", text: $draft.title)
        Toggle("Favorite", isOn: $draft.isFavorite)
    }
}
```

A binding is not storage. It is a read and write connection to storage owned elsewhere.

## Prefer narrower bindings

If a child edits only the title, pass only the title:

```swift
struct TitleField: View {
    @Binding var title: String

    var body: some View {
        TextField("Title", text: $title)
    }
}

TitleField(title: $draft.title)
```

The child's API now states exactly what it may mutate. Passing an entire model to a leaf view grants more authority and makes reuse harder.

## Derive facts instead of copying them

```swift
var canSave: Bool {
    !draft.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
}
```

Do not store `canSave` independently and try to update it after every title change. The title is truth. Save readiness is a calculation from that truth.

Duplication creates contradictory states:

```text
draft.title = ""
stored canSave = true
```

The same rule applies to filtered arrays, counts, selection summaries, and formatted labels unless measured performance justifies a cache with explicit invalidation.

## Initialization is not synchronization

`State(initialValue:)` seeds storage when an identity first appears. A later change to the initializer input does not overwrite existing local state.

That is helpful for a draft. It is surprising if the parent expects every new `note` argument to replace the editor contents. Choose the product contract:

- Give each note editor stable identity tied to `note.id`.
- Handle note changes explicitly and decide what happens to unsaved work.
- Avoid forcing refreshes with arbitrary `.id(UUID())` values.

## Model one presentation fact once

Several Booleans can describe impossible combinations:

```swift
@State var showsEditor = false
@State var showsDeleteAlert = false
@State var showsShareSheet = false
```

An enum can express mutual exclusion:

```swift
enum PresentedItem: Identifiable {
    case editor(FieldNote.ID)
    case deleteConfirmation(FieldNote.ID)

    var id: String { String(describing: self) }
}

@State private var presentedItem: PresentedItem?
```

Part 38 applies this model to sheets, alerts, and routes.

## Match lifetime to identity

Use `@State` for interface-owned values such as a draft, selected segment, disclosure, or pending confirmation. Durable notes belong in the application model or persistence layer. A view disappearing should not silently destroy data the product promised to retain.

Identity sets the lifetime of local storage. Stable IDs matter anywhere a child owns state, focus, animation, or a task.

## Review questions

For each wrapper, ask:

1. Who creates this storage?
2. Who may mutate it?
3. How long should it live?
4. Which identity anchors that lifetime?
5. Is any other property storing the same fact?

If the answers are unclear, the wrapper choice is probably masking an ownership problem.

## Validation boundary

The state and binding examples were claims-audited but not compiled with SwiftUI. Xcode, Apple SDK, Simulator, and state-restoration behavior remain Not verified.

## Series navigation

- Previous: [Part 34: SwiftUI controls, forms, validation, focus, and keyboards](../2026-07-19-swiftui-controls-forms-validation-focus-keyboard/)
- Next: Part 36, Observation, environment, and dependency flow
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [State](https://developer.apple.com/documentation/swiftui/state) describes interface-owned persistent storage.
- [Binding](https://developer.apple.com/documentation/swiftui/binding) represents read and write access to a value owned elsewhere.
- [Model data](https://developer.apple.com/documentation/swiftui/model-data) connects state ownership, observable data, and environment values.
