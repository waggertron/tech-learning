import XCTest

final class FieldNotesUIKitUITests: XCTestCase {
    func testEmptyLibraryHasAUsefulState() {
        let app = XCUIApplication()
        app.launch()

        XCTAssertTrue(app.navigationBars["Field Notes"].waitForExistence(timeout: 5))
        XCTAssertTrue(app.staticTexts["No Notes Yet"].waitForExistence(timeout: 5))
    }
}
