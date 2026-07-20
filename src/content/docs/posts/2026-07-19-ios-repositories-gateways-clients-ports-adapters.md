---
title: Repositories, gateways, clients, and ports and adapters
description: "Define purpose-named application ports where substitution, testing, or failure policy justifies an external boundary."
date: 2026-07-19
tags: [ios, swift, architecture, repositories, ports-and-adapters, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-repositories-gateways-clients-ports-adapters/
series:
  slug: zero-to-ios-hero
  order: 66
---

A port states what the application needs from an external capability. An adapter translates that contract to SwiftData, files, URLSession, CloudKit, or a deterministic local implementation.

## Name the application purpose

```swift
protocol NoteLibrary: Sendable {
    func notes(matching query: NoteQuery) async throws -> [Note]
    func note(id: UUID) async throws -> Note?
    func save(_ note: Note) async throws
    func delete(id: UUID) async throws
}
```

`NoteLibrary` describes Field Notes. `SwiftDataRepositoryProtocol` would expose a vendor choice and encourage persistence details to leak into callers.

## Make adapters honor one contract

An in-memory adapter should preserve identity, validation, ordering, replacement, and read-after-write behavior. A SwiftData adapter maps persistent models to domain values and translates storage failures into application errors. Contract tests run the same scenarios against both.

Different names signal different responsibilities:

- a repository or library offers collection-like domain access
- a gateway wraps an external business capability
- a client handles a transport protocol such as HTTP
- an adapter translates between an application port and one technology

Names matter less than clear ownership and dependency direction.

## Do not protocolize everything

A concrete pure formatter needs no interface just because it is concrete. Add a port when there is a volatile integration, useful local substitute, test distance improvement, or policy boundary. Keep transactions and multi-step consistency in one owner rather than leaking a sequence of primitive calls to every use case.

## Series navigation

- Previous: [Part 65: Coordinators, routers, deep links, and restoration](../2026-07-19-ios-coordinators-routers-deep-links-restoration/)
- Next: [Part 67: Modularization with Swift Package Manager](../2026-07-19-ios-modularization-swift-package-manager/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Adding and editing persistent data](https://developer.apple.com/documentation/swiftdata/adding-and-editing-persistent-data-in-your-app) describes SwiftData persistence operations.
- [URLSession](https://developer.apple.com/documentation/foundation/urlsession) is Foundation's HTTP and transfer boundary.

## Related topics

- [SwiftUI with SwiftData, queries, migration, and test stores](../2026-07-19-swiftui-swiftdata-queries-relationships-migration-test-stores/)
- [Swift protocols and protocol-oriented design](../2026-07-16-swift-protocols-extensions-protocol-oriented-design/)
