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

Domain code holds behavior that must remain true regardless of which screen, database, or API is active. Its types use the product's language and prevent invalid states where practical.

## Turn rules into values

```swift
struct Tag: Hashable, Sendable {
    let value: String

    init(_ raw: String) throws {
        let normalized = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard (1...24).contains(normalized.count) else {
            throw ValidationError.invalidTag
        }
        value = normalized.lowercased()
    }
}

struct Coordinate: Equatable, Sendable {
    let latitude: Double
    let longitude: Double

    init(latitude: Double, longitude: Double) throws {
        guard (-90...90).contains(latitude), (-180...180).contains(longitude) else {
            throw ValidationError.invalidCoordinate
        }
        self.latitude = latitude
        self.longitude = longitude
    }
}
```

Once created, these values carry their validity into SwiftUI, UIKit, storage adapters, and sync operations.

## Put orchestration in use cases

```swift
struct CreateNote {
    var makeID: () -> UUID
    var now: () -> Date
    var save: (Note) async throws -> Void

    func callAsFunction(draft: NoteDraft) async throws -> Note {
        let title = try NoteTitle(draft.title)
        let note = Note(id: makeID(), title: title, body: draft.body, createdAt: now())
        try await save(note)
        return note
    }
}
```

The use case owns the complete action. The UI supplies intent; adapters supply IDs, time, and persistence.

## Avoid an anemic mirror

A type that only repeats database columns or JSON fields is a transport shape, not automatically a domain model. Translate external shapes at the boundary, then keep product rules in types whose names and behavior reflect Field Notes.

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
