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
