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

The app's default persistence is a versioned JSON file. SwiftData is an alternative adapter lesson, not a second store silently writing the same library. A persistence framework needs its own schema and migration evidence.

## Change a shipped schema deliberately

Version 1 stores a note ID and title. Version 2 adds an optional summary so existing data has a valid destination without inventing missing content.

The complete specimen is `Apps/SwiftUI/NoteStoreSchema.swift`:

```swift
import Foundation
import SwiftData

/// This is an alternative persistence lesson, not the app's selected file adapter.
enum NoteSchemaV1: VersionedSchema {
    static var versionIdentifier: Schema.Version { Schema.Version(1, 0, 0) }
    static var models: [any PersistentModel.Type] { [StoredNote.self] }
    @Model final class StoredNote {
        @Attribute(.unique) var id: String
        var title: String
        init(id: String, title: String) { self.id = id; self.title = title }
    }
}

enum NoteSchemaV2: VersionedSchema {
    static var versionIdentifier: Schema.Version { Schema.Version(2, 0, 0) }
    static var models: [any PersistentModel.Type] { [StoredNote.self] }
    @Model final class StoredNote {
        @Attribute(.unique) var id: String
        var title: String
        var summary: String?
        init(id: String, title: String, summary: String? = nil) {
            self.id = id; self.title = title; self.summary = summary
        }
    }
}

enum NoteMigrationPlan: SchemaMigrationPlan {
    static var schemas: [any VersionedSchema.Type] { [NoteSchemaV1.self, NoteSchemaV2.self] }
    static var stages: [MigrationStage] {
        [.lightweight(fromVersion: NoteSchemaV1.self, toVersion: NoteSchemaV2.self)]
    }
}
```

Both versions use a nested model named `StoredNote`. The migration plan lists the old and new schemas in order and declares the lightweight transition. The immutable domain `FieldNote` remains separate from these mutable persistent objects.

## Start from an old store

`Tests/SwiftUIAppTests/NoteMigrationTests.swift` creates a version 1 store in a temporary directory, inserts `old-note`, closes that container's scope, then opens the same URL with version 2 and the migration plan.

Its assertions check that exactly one note remains, its ID and title are unchanged, and the new summary is nil. That is different from creating an empty version 2 database and declaring migration successful.

```swift
let schema = Schema(versionedSchema: NoteSchemaV2.self)
let configuration = ModelConfiguration(schema: schema, url: url)
let container = try ModelContainer(
    for: schema,
    migrationPlan: NoteMigrationPlan.self,
    configurations: [configuration]
)
```

The same suite creates two separate in-memory containers and proves that inserting into one does not seed the other. Use a fresh container for each preview/test. Do not connect previews to a person's live store.

## Separate failure policies

If a migration cannot open a store, keep the source intact and show a recovery path. Deleting the file and retrying is data loss, not migration recovery. A production migration also needs unsupported-schema, relationship, uniqueness, disk-full, and interruption cases that this small additive specimen does not claim to cover.

The file adapter's package tests already cover malformed data, unsupported version, failed replacement preserving the previous bytes, and reopen. Those results do not prove SwiftData behavior.

## Run the matching evidence

Generate the companion Xcode project, resolve an installed destination, and run the `FieldNotesSwiftUI` scheme. `NoteMigrationTests` belongs to its app-test target.

The specimen was syntax-parsed but not type-checked or executed against SwiftData because full Xcode is unavailable. Migration and isolated-container results remain unverified. The API shape was reviewed against Apple's SchemaMigrationPlan, ModelConfiguration, and ModelContainer references on 2026-11-17.

## Series navigation

- Previous: [Part 39: SwiftUI async work, loading states, networking, and images](../2026-07-19-swiftui-async-loading-networking-images/)
- Next: [Part 41: SwiftUI animation, gestures, drag and drop, and drawing](../2026-07-19-swiftui-animation-transitions-gestures-drag-drop-drawing/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SchemaMigrationPlan](https://developer.apple.com/documentation/swiftdata/schemamigrationplan) defines ordered schemas and migration stages.
- [ModelContainer schema initializer](https://developer.apple.com/documentation/swiftdata/modelcontainer/init(for:migrationplan:configurations:)-1czix) accepts the schema, migration plan, and configuration array.

- [SwiftData](https://developer.apple.com/documentation/swiftdata) documents models, containers, contexts, and queries.
- [Adding and editing persistent data in your app](https://developer.apple.com/documentation/swiftdata/adding-and-editing-persistent-data-in-your-app) shows SwiftData model definitions and editing.
- [Preserving your app's model data across launches](https://developer.apple.com/documentation/swiftdata/preserving-your-apps-model-data-across-launches) covers container-backed persistence.

## Related topics

- [State, bindings, source of truth, and identity](../2026-07-19-swiftui-state-bindings-source-truth-identity/)
- [Modules, packages, access control, interoperability, and API design](../2026-07-19-swift-modules-packages-access-control-interoperability-api-design/)
