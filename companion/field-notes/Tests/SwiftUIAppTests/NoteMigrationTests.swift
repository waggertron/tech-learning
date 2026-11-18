import Foundation
import SwiftData
import XCTest
@testable import FieldNotesSwiftUI

@MainActor
final class NoteMigrationTests: XCTestCase {
    func testVersionOneStorePreservesIdentityAndTitle() throws {
        let directory = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        defer { try? FileManager.default.removeItem(at: directory) }
        let url = directory.appendingPathComponent("migration.store")
        try autoreleasepool {
            let schema = Schema(versionedSchema: NoteSchemaV1.self)
            let configuration = ModelConfiguration(schema: schema, url: url)
            let container = try ModelContainer(for: schema, configurations: [configuration])
            let context = ModelContext(container)
            context.insert(NoteSchemaV1.StoredNote(id: "old-note", title: "Creek crossing"))
            try context.save()
        }
        let schema = Schema(versionedSchema: NoteSchemaV2.self)
        let configuration = ModelConfiguration(schema: schema, url: url)
        let container = try ModelContainer(for: schema, migrationPlan: NoteMigrationPlan.self, configurations: [configuration])
        let context = ModelContext(container)
        let notes = try context.fetch(FetchDescriptor<NoteSchemaV2.StoredNote>())
        XCTAssertEqual(notes.count, 1)
        XCTAssertEqual(notes.first?.id, "old-note")
        XCTAssertEqual(notes.first?.title, "Creek crossing")
        XCTAssertNil(notes.first?.summary)
    }

    func testPreviewContainersAreIsolated() throws {
        let schema = Schema(versionedSchema: NoteSchemaV2.self)
        let first = try ModelContainer(for: schema, configurations: [ModelConfiguration(schema: schema, isStoredInMemoryOnly: true)])
        let second = try ModelContainer(for: schema, configurations: [ModelConfiguration(schema: schema, isStoredInMemoryOnly: true)])
        let firstContext = ModelContext(first)
        firstContext.insert(NoteSchemaV2.StoredNote(id: "preview", title: "Preview only"))
        try firstContext.save()
        XCTAssertTrue(try ModelContext(second).fetch(FetchDescriptor<NoteSchemaV2.StoredNote>()).isEmpty)
    }
}
