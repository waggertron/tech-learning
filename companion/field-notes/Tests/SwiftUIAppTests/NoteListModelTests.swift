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
