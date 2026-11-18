import FieldNotesCore
import FieldNotesTestSupport
@testable import FieldNotesSwiftUI
import XCTest

@MainActor
final class NoteListModelTests: XCTestCase {
    func testLoadShowsDeterministicNotes() async {
        let model = NoteListModel(
            library: NoteLibrary(repository: FieldNotesFixtures.repository())
        )

        await model.load()

        XCTAssertEqual(model.notes.map(\.id), [
            FieldNotesFixtures.redwood.id,
            FieldNotesFixtures.tidePools.id,
        ])
        XCTAssertNil(model.errorMessage)
    }

    func testLoadFailureShowsProductMessage() async {
        let model = NoteListModel(
            library: NoteLibrary(repository: FailingNoteRepository())
        )

        await model.load()

        XCTAssertTrue(model.notes.isEmpty)
        XCTAssertEqual(
            model.errorMessage,
            "Notes could not be loaded. Your saved data was not changed."
        )
    }
}

extension NoteListModelTests {
    func testCreateAndSearchUseSharedLibrary() async throws {
        let model = NoteListModel(library: NoteLibrary(repository: InMemoryNoteRepository()))
        try await model.save(NoteDraft(title: "Creek", body: "Low water", tags: "trail"))
        model.query = "WATER"
        XCTAssertEqual(model.visibleNotes.map(\.title), ["Creek"])
        model.query = "missing"
        XCTAssertTrue(model.visibleNotes.isEmpty)
    }
}

private actor FailAfterFirstLoadRepository: NoteRepository {
    private var firstLoad = true
    func load() throws -> [FieldNote] {
        if firstLoad { firstLoad = false; return [FieldNotesFixtures.redwood] }
        throw FieldNotesFixtureFailure.requested
    }
    func save(_ note: FieldNote) throws { throw FieldNotesFixtureFailure.requested }
    func delete(id: NoteID) throws { throw FieldNotesFixtureFailure.requested }
}

extension NoteListModelTests {
    func testRefreshFailureRetainsNotesAndExposesRecoveryMessage() async {
        let model = NoteListModel(library: NoteLibrary(repository: FailAfterFirstLoadRepository()))
        await model.load()
        XCTAssertEqual(model.notes, [FieldNotesFixtures.redwood])
        XCTAssertNil(model.errorMessage)
        await model.load()
        XCTAssertEqual(model.notes, [FieldNotesFixtures.redwood])
        XCTAssertEqual(model.visibleNotes, [FieldNotesFixtures.redwood])
        XCTAssertEqual(model.errorMessage, "Notes could not be loaded. Your saved data was not changed.")
        XCTAssertFalse(model.isLoading)
    }
}
