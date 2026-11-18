import XCTest

final class FieldNotesUIKitUITests: XCTestCase {
    func testCreateEditAndRelaunch() {
        let app = XCUIApplication()
        app.launchArguments = ["--ui-testing", "--store-name", "create-edit", "--reset-store"]
        app.launch()
        app.buttons["New Note"].tap()
        app.buttons["Save"].tap()
        XCTAssertTrue(app.staticTexts["Enter a title."].waitForExistence(timeout: 3))
        app.textFields["Title"].tap()
        app.textFields["Title"].typeText("Creek crossing")
        app.buttons["Save"].tap()
        XCTAssertTrue(app.staticTexts["Creek crossing"].waitForExistence(timeout: 3))
        app.staticTexts["Creek crossing"].firstMatch.tap()
        app.buttons["Edit Note"].tap()
        app.textViews["Observation"].tap()
        app.textViews["Observation"].typeText("Water level is low")
        app.buttons["Save"].tap()
        app.terminate()
        app.launchArguments = ["--ui-testing", "--store-name", "create-edit"]
        app.launch()
        XCTAssertTrue(app.staticTexts["Creek crossing"].waitForExistence(timeout: 3))
        app.staticTexts["Creek crossing"].firstMatch.tap()
        XCTAssertTrue(app.staticTexts.containing(NSPredicate(format: "label CONTAINS %@", "Water level is low")).firstMatch.waitForExistence(timeout: 3))
    }

    func testSaveFailurePreservesDraftAndRetrySavesOnce() {
        let app = XCUIApplication()
        app.launchArguments = ["--ui-testing", "--store-name", "save-failure", "--reset-store", "--fail-first-save"]
        app.launch()
        app.buttons["New Note"].tap()
        app.textFields["Title"].tap()
        app.textFields["Title"].typeText("Retained draft")
        app.buttons["Save"].tap()
        XCTAssertTrue(app.staticTexts["The note was not saved. Your draft is safe. Try Save again."].waitForExistence(timeout: 3))
        XCTAssertEqual(app.textFields["Title"].value as? String, "Retained draft")
        app.buttons["Save"].tap()
        XCTAssertTrue(app.staticTexts["Retained draft"].waitForExistence(timeout: 3))
        XCTAssertEqual(app.staticTexts["Retained draft"].count, 1)
    }

    func testDelayedSaveLocksEditingAndFailureRestoresIt() {
        let app = XCUIApplication()
        app.launchArguments = ["--ui-testing", "--store-name", "delayed-save", "--reset-store", "--fail-first-save", "--delay-save"]
        app.launch()
        app.buttons["New Note"].tap()
        app.textFields["Title"].tap()
        app.textFields["Title"].typeText("Submitted snapshot")
        app.buttons["Save"].tap()
        XCTAssertFalse(app.textFields["Title"].isEnabled)
        XCTAssertFalse(app.textFields["Tags, separated by commas"].isEnabled)
        XCTAssertFalse(app.textViews["Observation"].isEnabled)
        XCTAssertFalse(app.buttons["Cancel"].isEnabled)
        XCTAssertFalse(app.buttons["Save"].isEnabled)
        XCTAssertTrue(app.staticTexts["The note was not saved. Your draft is safe. Try Save again."].waitForExistence(timeout: 5))
        XCTAssertTrue(app.textFields["Title"].isEnabled)
        XCTAssertTrue(app.buttons["Cancel"].isEnabled)
        app.textFields["Title"].tap()
        app.textFields["Title"].typeText(" revised")
        app.buttons["Save"].tap()
        XCTAssertFalse(app.textFields["Title"].isEnabled)
        XCTAssertTrue(app.staticTexts["Submitted snapshot revised"].waitForExistence(timeout: 5))
    }

}
