import FieldNotesCore
import FieldNotesTestSupport
@testable import FieldNotesUIKit
import XCTest

@MainActor
final class NoteListViewControllerTests: XCTestCase {
    func testControllerLoadsDeterministicNotes() async {
        let controller = NoteListViewController(
            library: NoteLibrary(repository: FieldNotesFixtures.repository())
        )
        controller.loadViewIfNeeded()

        await controller.load()

        XCTAssertEqual(controller.title, "Field Notes")
        XCTAssertEqual(controller.tableView.numberOfRows(inSection: 0), 2)
        XCTAssertNil(controller.contentUnavailableConfiguration)
    }
}
