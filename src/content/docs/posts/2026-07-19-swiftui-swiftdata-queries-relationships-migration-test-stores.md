---
title: SwiftUI with SwiftData, queries, migration, and test stores
description: "Connect SwiftData models, queries, relationships, disk containers, migrations, and isolated test stores without losing domain boundaries."
date: 2026-07-19
tags: [ios, swift, swiftui, swiftdata, persistence]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-swiftdata-queries-relationships-migration-test-stores/
series:
  slug: zero-to-ios-hero
  order: 40
---

SwiftData can make persistence feel like part of the view tree. The database still has a separate lifetime, schema, failure surface, and migration history.

## Define a persistence model deliberately

```swift
import SwiftData

@Model
final class StoredNote {
    @Attribute(.unique) var id: String
    var title: String
    var body: String
    var updatedAt: Date
    @Relationship(deleteRule: .cascade) var attachments: [StoredAttachment]

    init(id: String, title: String, body: String, updatedAt: Date) {
        self.id = id
        self.title = title
        self.body = body
        self.updatedAt = updatedAt
        self.attachments = []
    }
}
```

The persistence type describes stored shape and relationships. Field Notes can map it to a validated `FieldNote` domain value so storage annotations and mutable managed lifetime do not spread through every use case.

## Compose a disk container once

```swift
@main
struct FieldNotesApp: App {
    private let container: ModelContainer

    init() {
        container = try! ModelContainer(for: StoredNote.self, StoredAttachment.self)
    }

    var body: some Scene {
        WindowGroup { NoteListScreen() }
            .modelContainer(container)
    }
}
```

A shipping app should replace the force with an explicit startup failure policy. It may show recovery, preserve the store for support, or open a controlled read-only path. Silently deleting a store after an error can destroy user data.

## Query for presentation, not every rule

```swift
struct NoteListScreen: View {
    @Query(sort: \StoredNote.updatedAt, order: .reverse)
    private var notes: [StoredNote]

    var body: some View {
        List(notes) { note in
            Text(verbatim: note.title)
        }
    }
}
```

`@Query` is useful when a view directly owns a simple fetch presentation. Complex authorization, sync conflict rules, transactions, or framework-neutral reuse belong behind an application boundary.

## Use isolated test and preview stores

```swift
let configuration = ModelConfiguration(isStoredInMemoryOnly: true)
let container = try ModelContainer(
    for: StoredNote.self,
    configurations: configuration
)
```

Each test gets a fresh container and valid fixtures. An in-memory store proves model and query behavior, not disk durability, file protection, migration, or crash recovery.

## Treat migration as shipped behavior

A schema change needs old-store fixtures and an expected destination. Test required and optional fields, relationship changes, uniqueness, interrupted migration, and data the current app no longer creates but older releases did.

```text
version 1 store -> migration plan -> version 2 store
       |                              |
       +-- preserved IDs and notes ---+
```

Never test only a fresh latest schema and call persistence complete.

## Validation boundary

The code is claims-audited but not compiled. SwiftData requires an Apple SDK and supported deployment target. Container creation, queries, relationships, disk durability, and migrations remain Not verified.

## Series navigation

- Previous: [Part 39: SwiftUI async work, loading states, networking, and images](../2026-07-19-swiftui-async-loading-networking-images/)
- Next: [Part 41: SwiftUI animation, gestures, drag and drop, and drawing](../2026-07-19-swiftui-animation-transitions-gestures-drag-drop-drawing/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SwiftData](https://developer.apple.com/documentation/swiftdata) documents models, containers, contexts, and queries.
- [Adding and editing persistent data in your app](https://developer.apple.com/documentation/swiftdata/adding-and-editing-persistent-data-in-your-app) shows SwiftData model definitions and editing.
- [Preserving your app's model data across launches](https://developer.apple.com/documentation/swiftdata/preserving-your-apps-model-data-across-launches) covers container-backed persistence.

## Related topics

- [State, bindings, source of truth, and identity](../2026-07-19-swiftui-state-bindings-source-truth-identity/)
- [Modules, packages, access control, interoperability, and API design](../2026-07-19-swift-modules-packages-access-control-interoperability-api-design/)
