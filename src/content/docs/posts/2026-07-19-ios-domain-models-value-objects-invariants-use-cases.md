---
title: Domain models, value objects, invariants, and use cases
description: "Protect Field Notes business meaning with validated values and use cases that remain independent of screens, databases, and APIs."
date: 2026-07-19
tags: [ios, swift, architecture, domain-modeling, use-cases, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-domain-models-value-objects-invariants-use-cases/
series:
  slug: zero-to-ios-hero
  order: 63
---

The same rules apply when a note is created from SwiftUI, UIKit, a command line, or a decoded file. Put those rules into values and use cases that each adapter can call.

## Reject invalid values at construction

```swift
import Foundation

public struct Tag: Hashable, Sendable {
    public let value: String

    public init(_ raw: String) throws {
        let normalized = raw.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard (1...24).contains(normalized.count) else { throw FieldNoteValidationError.invalidTag }
        value = normalized
    }
}

public struct Coordinate: Equatable, Sendable {
    public let latitude: Double
    public let longitude: Double

    public init(latitude: Double, longitude: Double) throws {
        guard latitude.isFinite, longitude.isFinite,
              (-90...90).contains(latitude), (-180...180).contains(longitude) else {
            throw FieldNoteValidationError.invalidCoordinate
        }
        self.latitude = latitude
        self.longitude = longitude
    }
}


```

`Tag` trims and normalizes a label, then rejects empty or overlong values. `Coordinate` rejects non-finite values as well as out-of-range coordinates. Checking only numeric ranges without understanding invalid floating-point values makes a boundary harder to reason about.

The note app does not currently collect location. `Coordinate` is a tested domain-value example, not evidence of Core Location authorization or device behavior.

## Model editable input separately

`NoteDraft` carries a stable note ID, editable text, comma-separated tags, favorite state, and an optional original creation time. A new draft gets its ID before the first submission. An edit copies an existing note and retains its creation time.

The title readiness check is a UI convenience. `FieldNote` still rejects blank titles at construction, including during decoding. File data does not get permission to bypass domain rules because it came from a previously saved store.

## Keep orchestration small

```swift
public struct SaveNote: Sendable {
    private let library: NoteLibrary
    private let now: @Sendable () -> Date

    public init(library: NoteLibrary, now: @escaping @Sendable () -> Date = { Date() }) {
        self.library = library
        self.now = now
    }

    @discardableResult
    public func callAsFunction(_ draft: NoteDraft) async throws -> FieldNote {
        let date = now()
        let tags = try draft.parsedTags.map { try Tag($0).value }
        let note = try FieldNote(
            id: draft.id, title: draft.title, body: draft.body, tags: tags,
            isFavorite: draft.isFavorite, createdAt: draft.createdAt ?? date, updatedAt: date
        )
        try Task.checkCancellation()
        try await library.save(note)
        return note
    }
}
```

Time is injected, so a test can assert exact timestamps. Identity is supplied by the draft, so repeated attempts retain one ID. The repository owns replacement and durability; the use case does not infer a successful disk write from a changed UI property.

The package tests prove valid/boundary/invalid tags and coordinates, fixed identity/time, creation time preservation on edit, and failure leaving input unchanged. Run `./scripts/test-package.sh` from `companion/field-notes`.

## Separate rules from representation

The default app uses a versioned JSON file repository. A separate SwiftData lesson maps its own stored model. Neither annotation belongs on `NoteDraft` or `SaveNote`. This keeps domain behavior executable without an iOS runtime.

## Series navigation

- Previous: [Part 62: Unidirectional data flow, reducers, and state machines](../2026-07-19-ios-unidirectional-data-flow-reducers-state-machines/)
- Next: [Part 64: Dependency injection and the composition root](../2026-07-19-ios-dependency-injection-composition-root/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Structures and classes](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/) describes Swift value and reference types.
- [Initialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/) covers establishing valid stored state.

## Related topics

- [Swift structures and value semantics](../2026-07-16-swift-structures-value-semantics/)
- [Swift properties, methods, and initialization](../2026-07-16-swift-properties-methods-subscripts-initialization-deinitialization/)
