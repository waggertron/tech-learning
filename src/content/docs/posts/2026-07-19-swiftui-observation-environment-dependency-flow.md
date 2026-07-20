---
title: SwiftUI Observation, environment, and dependency flow
description: "Connect observable models, bindable editing, environment context, and injected services without creating hidden global dependencies."
date: 2026-07-19
tags: [ios, swift, swiftui, observation, dependency-injection]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-observation-environment-dependency-flow/
series:
  slug: zero-to-ios-hero
  order: 36
---

Observation tells SwiftUI which model reads can affect a view. Dependency injection tells the application where those models and their services come from. They solve related but different problems.

## Keep the model on the main actor

```swift
import Observation

@MainActor
@Observable
final class NoteListModel {
    private let library: NoteLibrary

    private(set) var notes: [FieldNote] = []
    private(set) var isLoading = false
    private(set) var errorMessage: String?

    init(library: NoteLibrary) {
        self.library = library
    }

    func load() async {
        isLoading = true
        defer { isLoading = false }

        do {
            notes = try await library.notes()
            errorMessage = nil
        } catch is CancellationError {
            return
        } catch {
            errorMessage = "Notes could not be loaded."
        }
    }
}
```

The model owns presentation state and coordinates a library contract. The library owns domain operations. The view does not know whether the repository is in memory, on disk, or remote.

## Let the app own shared models

```swift
@main
struct FieldNotesApp: App {
    @State private var model = NoteListModel(
        library: NoteLibrary(repository: InMemoryNoteRepository())
    )

    var body: some Scene {
        WindowGroup {
            NoteListView(model: model)
        }
    }
}
```

`@State` gives this observable model a lifetime tied to the scene's view identity. A child can accept it as plain input:

```swift
struct NoteListView: View {
    let model: NoteListModel

    var body: some View {
        List(model.notes) { note in
            Text(note.title)
        }
        .overlay {
            if model.isLoading { ProgressView() }
        }
        .task { await model.load() }
    }
}
```

SwiftUI tracks the observable properties read while forming this view. Reading `notes` and `isLoading` establishes relevant dependencies.

## Use bindable access for editable model properties

When a control needs a binding into an observable model, create bindable access at the editing boundary:

```swift
struct SettingsView: View {
    @Bindable var model: SettingsModel

    var body: some View {
        Toggle("Show archived notes", isOn: $model.showsArchived)
    }
}
```

Do not expose mutation merely because a property is observable. Keep setters private when children only need to read, and expose named methods when changes require validation or side effects.

## Use environment for scoped context

Environment values fit dependencies that many descendants need within a clear interface scope, such as locale, dismiss behavior, or a deliberately injected application context.

They are a poor excuse for an invisible service registry. If any view can pull networking, persistence, analytics, and navigation from global environment state, dependencies become difficult to discover and tests need oversized setup.

Prefer explicit initializer injection for feature services and models. Use environment when the value is genuinely ambient and has a sensible scoped default or a deliberate missing-value failure.

## Build deterministic alternatives

```swift
let previewModel = NoteListModel(
    library: NoteLibrary(
        repository: InMemoryNoteRepository(seed: .previewNotes)
    )
)
```

Previews and tests get local fixtures. Production composition selects the disk-backed adapter later. Neither interface code nor domain code needs credentials or a cloud service.

## Review the dependency graph

```text
SwiftUI view
    |
    v
observable presentation model
    |
    v
application or domain contract
    |
    v
in-memory, disk, or network adapter
```

Dependencies point inward. Observation does not erase those layers. It only makes UI updates follow relevant property reads.

## Validation boundary

The existing companion app uses this broad composition shape, but this post's snippets were not compiled with Xcode. Observation integration, SwiftUI invalidation, previews, and Simulator behavior remain Not verified.

## Series navigation

- Previous: [Part 35: SwiftUI state, bindings, source of truth, and identity](../2026-07-19-swiftui-state-bindings-source-truth-identity/)
- Next: [Part 37: SwiftUI lists, grids, scrolling, search, selection, and refresh](../2026-07-19-swiftui-lists-grids-scrolling-search-selection-refresh/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Migrating from ObservableObject to Observable](https://developer.apple.com/documentation/swiftui/migrating-from-the-observable-object-protocol-to-the-observable-macro) explains the Observation transition.
- [Environment](https://developer.apple.com/documentation/swiftui/environment) reads values propagated through a view hierarchy.
- [Model data](https://developer.apple.com/documentation/swiftui/model-data) covers observable data and bindings.
