---
title: Persistence, migration, networking, and contract tests
description: "Exercise storage and HTTP adapters against shared contracts, versioned fixtures, corrupt inputs, retries, and transactional failure paths."
date: 2026-07-19
tags: [ios, swift, testing, persistence, migrations, networking, contracts, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-persistence-migration-network-contract-tests/
series:
  slug: zero-to-ios-hero
  order: 76
---

Boundary tests prove translation and failure behavior that pure domain tests cannot see. They should use the smallest real boundary available: an in-memory container, temporary directory, intercepted URL request, or credential-free local service.

## Run one storage contract everywhere

```swift
protocol NoteLibraryContract {
    func makeLibrary() async throws -> any NoteLibrary
}

func verifyRoundTrip(using contract: NoteLibraryContract) async throws {
    let library = try await contract.makeLibrary()
    let note = Note.fixture(title: "Creek crossing")
    try await library.save(note)
    let loaded = try await library.note(id: note.id)
    #expect(loaded == note)
}
```

Run the same identity, ordering, replacement, deletion, invalid-data, and read-after-write cases against memory and persistent adapters. Automated stores belong in unique temporary locations and clean themselves up.

## Keep historical fixtures

A fresh latest schema does not test migration. Preserve small versioned stores created by supported old releases. Test successful migration, missing optional data, incompatible relationships, interruption, and recovery from corrupt or unreadable files. Never silently replace durable user data with an empty store.

## Test the transport contract

Intercept requests below the client or point them at a deterministic local mock. Assert method, URL construction, headers without secret values, body encoding, status handling, DTO decoding, pagination, cancellation, and bounded retry. Production cloud services make poor default test dependencies.

Test multi-resource failure cleanup. If attachment bytes succeed but note metadata fails, the adapter must remove or reconcile the orphan according to an explicit transaction policy.

## Validation boundary

The contract shape is instructional. SwiftData and Core Data migrations require their Apple frameworks and are not marked as executed by the site build.

## Series navigation

- Previous: [Part 75: SwiftUI, UIKit, navigation, accessibility, and UI behavior tests](../2026-07-19-ios-swiftui-uikit-navigation-accessibility-ui-tests/)
- Next: [Part 77: Performance, memory, energy, launch, and device matrices](../2026-07-19-ios-performance-memory-energy-launch-device-matrices/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SwiftData](https://developer.apple.com/documentation/swiftdata) documents Apple's modern persistence framework.
- [Core Data](https://developer.apple.com/documentation/coredata) documents object graph persistence and migration capabilities.
- [URL Loading System](https://developer.apple.com/documentation/foundation/url-loading-system) covers requests, responses, sessions, and protocol loading.

## Related topics

- [Repositories, gateways, clients, and ports and adapters](../2026-07-19-ios-repositories-gateways-clients-ports-adapters/)
- [Data architecture, source of truth, caching, offline sync, and conflict](../2026-07-19-ios-data-architecture-source-truth-cache-offline-sync-conflict/)
