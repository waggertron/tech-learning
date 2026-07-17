PACKAGE_DIR := Packages/FieldNotesCore
PROJECT := FieldNotes.xcodeproj

.PHONY: package describe generate check-destination build-swiftui test-swiftui build-uikit test-uikit

package:
	swift build --package-path $(PACKAGE_DIR)
	./scripts/test-package.sh

describe:
	swift package --package-path $(PACKAGE_DIR) describe

generate:
	xcodegen generate --spec project.yml

check-destination:
	@test -n "$(DESTINATION)" || (echo "Set DESTINATION to a value reported by xcodebuild -showdestinations."; exit 1)

build-swiftui: check-destination
	xcodebuild build -project $(PROJECT) -scheme FieldNotesSwiftUI -destination "$(DESTINATION)" CODE_SIGNING_ALLOWED=NO

test-swiftui: check-destination
	xcodebuild test -project $(PROJECT) -scheme FieldNotesSwiftUI -destination "$(DESTINATION)" -resultBundlePath /tmp/FieldNotesSwiftUI.xcresult CODE_SIGNING_ALLOWED=NO

build-uikit: check-destination
	xcodebuild build -project $(PROJECT) -scheme FieldNotesUIKit -destination "$(DESTINATION)" CODE_SIGNING_ALLOWED=NO

test-uikit: check-destination
	xcodebuild test -project $(PROJECT) -scheme FieldNotesUIKit -destination "$(DESTINATION)" -resultBundlePath /tmp/FieldNotesUIKit.xcresult CODE_SIGNING_ALLOWED=NO
