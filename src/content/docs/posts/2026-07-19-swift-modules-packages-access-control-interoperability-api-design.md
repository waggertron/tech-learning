---
title: Modules, packages, access control, interoperability, and API design
description: "Extract a reusable FieldNotesCore library, shape its public surface, test it through SwiftPM, and keep C and Objective-C details at adapter boundaries."
date: 2026-07-19
tags: [swift, ios, swift-package-manager, modules, access-control, interoperability]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swift-modules-packages-access-control-interoperability-api-design/
series:
  slug: zero-to-ios-hero
  order: 23
---

A Swift module is a compilation and import boundary. A Swift package describes products, targets, dependencies, platform floors, and language modes that Swift Package Manager can build together. Good package design begins with the behavior consumers need, not with making every declaration public.

Field Notes uses a `FieldNotesCore` library so SwiftUI, UIKit, a command-line checkpoint, and tests can share the same note rules without importing one another.

## Package, product, target, and module

The words describe different layers:

| Term | Role |
| --- | --- |
| package | manifest and source tree managed by SwiftPM |
| product | library or executable another package can consume |
| target | unit of sources, settings, and dependencies |
| module | namespace produced by compiling a target |

The package manifest publishes `FieldNotesCore` as a library product and builds it from a target with the same name:

```swift
let package = Package(
    name: "FieldNotesCore",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
    ],
    products: [
        .library(
            name: "FieldNotesCore",
            targets: ["FieldNotesCore"]
        ),
    ],
    targets: [
        .target(name: "FieldNotesCore"),
        .testTarget(
            name: "FieldNotesCoreTests",
            dependencies: ["FieldNotesCore"]
        ),
    ],
    swiftLanguageModes: [.v6]
)
```

The manifest's platform floor describes where the product can be used. It does not prove an iOS app build. SwiftPM tests on this machine prove the package's host-compatible core only.

## Public API is a promise

Declarations default to `internal`, visible inside their module. Raise access only for a consumer need.

```swift
public protocol NoteRepository: Sendable {
    func load() async throws -> [FieldNote]
    func save(_ note: FieldNote) async throws
    func delete(id: NoteID) async throws
}

public struct NoteLibrary: Sendable {
    private let repository: any NoteRepository
}
```

The app can supply a repository, but it cannot reach through `NoteLibrary` and replace its dependency. The module exposes the use-case boundary and hides storage.

Swift access levels move from `private` and `fileprivate` through `internal`, `package`, and `public` to `open`. `open` matters for subclassing and overriding outside a module. Most domain APIs do not need it.

`package` supports implementation sharing among targets in one package without publishing that declaration to clients. It can be a better seam than making test helpers public.

## Design the call site first

A useful API makes ownership, mutation, failure, and concurrency visible:

```swift
let library = NoteLibrary(repository: repository)
let notes = try await library.notes(matching: "coast")
```

The initializer requires the dependency. The method name states the query. `async throws` preserves suspension and failure. The result stays in domain types.

Avoid public setters that let consumers create invalid state. Avoid framework types in the core unless the framework is part of the intended contract. A public API gets harder to change as more modules depend on it.

## Tests consume the boundary

The package has a dedicated Swift Testing target. Tests import `FieldNotesCore` and a deterministic support module, then verify ordering, search, normalization, failure, and mutation behavior.

```swift
@Test("Blank titles are rejected", arguments: ["", " ", "\n\t"])
func blankTitlesAreRejected(title: String) {
    #expect(throws: FieldNoteValidationError.blankTitle) {
        try FieldNote(
            id: NoteID(rawValue: "note-invalid"),
            title: title,
            createdAt: FieldNotesFixtures.firstDate,
            updatedAt: FieldNotesFixtures.firstDate
        )
    }
}
```

Testing only through public API exposes missing contracts. `@testable import` can reach internal declarations, but it can also couple tests to implementation details. Prefer public behavior unless an internal algorithm needs focused proof.

## Interoperability belongs at an edge

Swift can import C and Objective-C APIs through Clang modules and generated interfaces. Objective-C compatible Swift APIs use a smaller type system. Features such as associated types, many enums with payloads, and Swift-only concurrency contracts do not cross directly.

Keep imported pointers, status codes, nullability quirks, completion handlers, and Objective-C object graphs in an adapter:

```text
C or Objective-C API
        |
        v
interop adapter
        |
        v
FieldNotesCore values and errors
```

The adapter translates provider data once. The domain does not spread `UnsafePointer`, `NSError`, or framework-specific objects through every use case.

Use `@objc` and `NSObject` only where an Objective-C runtime contract needs them. Do not annotate the whole domain for hypothetical compatibility.

## Library evolution is a separate promise

A source package can rebuild clients and dependencies together. Binary frameworks introduce module stability, library evolution, ABI, resource, signing, and distribution concerns. Do not claim binary compatibility merely because a public Swift package builds.

Start with the source boundary. Add binary distribution constraints only when a real consumer requires them.

## Validation evidence

The companion package uses Swift tools version 6.0 and Swift 6 language mode. Its library, test-support, and command-line products build with warnings treated as errors under the available Apple Swift 6.3.2 Command Line Tools.

The package's seven Swift Testing checks are present, but this Command Line Tools installation does not expose the `Testing` module to `swift test`. The successful build proves the manifest, module imports, public API, in-memory actor repository, and CLI composition. It does not prove the test run, Xcode 26.6, an iOS SDK build, Objective-C header generation, a mixed-language target, binary library evolution, Simulator, signing, or device behavior.

## Check your understanding

You should now be able to explain:

- How a package, product, target, and module differ.
- Why `internal` is the right default.
- What consumer need makes a declaration public.
- Why tests through public behavior resist refactors better.
- Where C and Objective-C translation belongs.

The language foundation is now complete. The next post begins with the person using Field Notes, the situation they are in, and the smallest outcome worth shipping.

## Series navigation

- Previous: [Part 22: Property wrappers, result builders, and macros](../2026-07-19-swift-property-wrappers-result-builders-macros/)
- Next: [Part 24: From app idea to user problem](../2026-07-19-ios-app-idea-user-problem/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- **Package model**: [Swift Package Manager](https://www.swift.org/documentation/package-manager/) documents manifests, products, targets, dependencies, and package workflows.
- **Visibility rules**: [Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/) defines Swift access levels and their constraints.
- **Imported APIs**: [Using Imported C Functions and Macros in Swift](https://developer.apple.com/documentation/swift/using-imported-c-functions-and-macros-in-swift) covers Swift's C import conventions.

## Related topics

- [Protocols, extensions, and protocol-oriented design](../2026-07-16-swift-protocols-extensions-protocol-oriented-design/), the repository capability used at the module edge.
- [Generics, associated types, existentials, and opaque types](../2026-07-17-swift-generics-associated-types-existentials-opaque-types/), public type relationships and existential storage.
- [Actors, global actors, Sendable, and data isolation](../2026-07-18-swift-actors-global-actors-sendable-data-isolation/), concurrency contracts carried across the package API.
