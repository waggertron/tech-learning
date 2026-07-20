---
title: Concurrency architecture, isolation, cancellation, and lifecycle
description: "Assign mutable state to explicit isolation domains and connect every asynchronous task to a request, feature, scene, or app lifetime."
date: 2026-07-19
tags: [ios, swift, architecture, concurrency, actors, cancellation, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-concurrency-architecture-isolation-cancellation-lifecycle/
series:
  slug: zero-to-ios-hero
  order: 69
---

Concurrency architecture answers two questions before tasks are launched: who owns each mutable value, and what lifetime ends the work?

## Draw an isolation map

```text
MainActor: visible editor, routes, presentation phase
SyncEngine actor: outbox pass, cursor, retry state
NoteStore actor: transaction and durable mutation ordering
Sendable values: notes, changes, DTOs, acknowledgements
Unisolated work: pure decoding, validation, and formatting
```

```swift
actor SyncEngine {
    private var activeRun: Task<Void, Never>?

    func start() {
        guard activeRun == nil else { return }
        activeRun = Task { [weak self] in
            await self?.drainOutbox()
        }
    }

    func stop() {
        activeRun?.cancel()
        activeRun = nil
    }
}
```

The real drain loop checks cancellation before expensive work and between operations. Cancellation is a control signal, so cleanup and transaction rollback still run.

## Tie work to a lifetime

A search task belongs to the current query. An editor save belongs to the save command and may outlive one render, but not necessarily the scene. Background synchronization belongs to the approved background task window. Store each task where its owner can cancel it.

## Actors are ownership boundaries

An actor protects its isolated state. It is not merely a queue for arbitrary work, and making every service an actor can create unnecessary hops without clarifying ownership. Use detached tasks only when work truly has no inherited priority, actor context, task-local values, or structured parent lifetime.

## Series navigation

- Previous: [Part 68: Data architecture, source of truth, caching, offline sync, and conflict](../2026-07-19-ios-data-architecture-source-truth-cache-offline-sync-conflict/)
- Next: [Part 70: Architecture tests, refactoring seams, decisions, and tradeoffs](../2026-07-19-ios-architecture-tests-refactoring-decisions-tradeoffs/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Swift concurrency](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/) covers tasks, cancellation, actors, and sendable values.
- [MainActor](https://developer.apple.com/documentation/swift/mainactor) defines the global actor used for UI state.

## Related topics

- [Swift async and structured concurrency](../2026-07-18-swift-async-await-tasks-groups-cancellation-continuations/)
- [Swift actors, global actors, and Sendable](../2026-07-18-swift-actors-global-actors-sendable-data-isolation/)
