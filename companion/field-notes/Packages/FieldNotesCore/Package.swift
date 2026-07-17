// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "FieldNotesCore",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
    ],
    products: [
        .library(name: "FieldNotesCore", targets: ["FieldNotesCore"]),
        .library(name: "FieldNotesTestSupport", targets: ["FieldNotesTestSupport"]),
        .executable(name: "field-notes", targets: ["FieldNotesCLI"]),
    ],
    targets: [
        .target(name: "FieldNotesCore"),
        .target(
            name: "FieldNotesTestSupport",
            dependencies: ["FieldNotesCore"]
        ),
        .executableTarget(
            name: "FieldNotesCLI",
            dependencies: ["FieldNotesCore", "FieldNotesTestSupport"]
        ),
        .testTarget(
            name: "FieldNotesCoreTests",
            dependencies: ["FieldNotesCore", "FieldNotesTestSupport"]
        ),
    ],
    swiftLanguageModes: [.v6]
)
