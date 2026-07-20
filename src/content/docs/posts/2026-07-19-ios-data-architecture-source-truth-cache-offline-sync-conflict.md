---
title: Data architecture, source of truth, caching, offline sync, and conflict
description: "Treat durable local state as visible truth while an outbox, cursor, idempotent operations, and conflict policy reconcile server changes."
date: 2026-07-19
tags: [ios, swift, architecture, offline-first, synchronization, caching, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-data-architecture-source-truth-cache-offline-sync-conflict/
series:
  slug: zero-to-ios-hero
  order: 68
---

In a local-first app, the user must see a successful local edit even when the network is unavailable. Durable device state drives the interface while synchronization reconciles it with server state.

## Write locally and enqueue atomically

```swift
struct PendingOperation: Codable, Sendable {
    let operationID: UUID
    let noteID: UUID
    let baseRevision: Int
    let change: NoteChange
}

protocol LocalNoteStore: Sendable {
    func apply(_ change: NoteChange, enqueueing operation: PendingOperation) async throws
    func pendingOperations() async throws -> [PendingOperation]
    func acknowledge(operationID: UUID, serverRevision: Int) async throws
}
```

The note change and outbox record must commit together. A crash cannot leave a visible edit that synchronization forgot, or an operation for an edit that never committed.

## Make retries idempotent

The server records `operationID`. Repeating the same upload returns the original result instead of applying the mutation twice. A sync cursor tracks which remote changes the device has incorporated, but it is not a replacement for per-operation acknowledgement.

## Choose and expose conflict policy

Last-write-wins is simple but can silently discard work. Field Notes can merge independent fields automatically and present a visible choice when both device and server changed the same body from one base revision. Preserve both versions until resolution succeeds.

A cache is disposable by contract. The note library and pending outbox are durable product state. Calling the network the only source of truth hides offline edits and makes transient availability control the interface.

## Series navigation

- Previous: [Part 67: Modularization with Swift Package Manager](../2026-07-19-ios-modularization-swift-package-manager/)
- Next: [Part 69: Concurrency architecture, isolation, cancellation, and lifecycle](../2026-07-19-ios-concurrency-architecture-isolation-cancellation-lifecycle/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SwiftData](https://developer.apple.com/documentation/swiftdata) provides an Apple persistence framework suitable for durable local models.
- [URLSession](https://developer.apple.com/documentation/foundation/urlsession) supplies network transfer tasks and cancellation.

## Related topics

- [SwiftUI with SwiftData, queries, migration, and test stores](../2026-07-19-swiftui-swiftdata-queries-relationships-migration-test-stores/)
- [UIKit observation, concurrency, networking, and persistence](../2026-07-19-uikit-observation-concurrency-networking-persistence/)
