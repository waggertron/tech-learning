---
title: Dependency injection and the composition root
description: "Select clocks, identifiers, storage, APIs, and analytics once at startup instead of hiding them in global state."
date: 2026-07-19
tags: [ios, swift, architecture, dependency-injection, composition-root, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-dependency-injection-composition-root/
series:
  slug: zero-to-ios-hero
  order: 64
---

Dependency injection means a type receives the collaborators it needs. A composition root is the narrow startup location that chooses concrete live, preview, or test implementations and connects them.

## Make the graph visible

```swift
struct AppDependencies {
    var clock: @Sendable () -> Date
    var makeID: @Sendable () -> UUID
    var library: any NoteLibrary
    var analytics: any Analytics
}

@MainActor
func makeApp(dependencies: AppDependencies) -> AppModel {
    let createNote = CreateNote(
        makeID: dependencies.makeID,
        now: dependencies.clock,
        save: dependencies.library.save
    )
    return AppModel(createNote: createNote, analytics: dependencies.analytics)
}
```

Production startup supplies a durable library and real clock. Tests supply fixed time, predictable IDs, an in-memory library, and recording analytics. The use case itself does not branch on environment.

## Prefer explicit construction

Initializer injection makes required collaborators visible and keeps instances immutable. Method injection suits a value needed for one operation. Environment-based injection can be useful near SwiftUI, but core dependencies should still have clear ownership and defaults that do not silently reach production services.

## Avoid mutable service location

A singleton registry hides the dependency graph, permits tests to affect one another, and allows any code to acquire any service. Moving a global behind a protocol changes its spelling, not its lifetime or ownership risk.

The composition root may be framework-specific because startup is framework-specific. The objects it creates can remain independent.

## Series navigation

- Previous: [Part 63: Domain models, value objects, invariants, and use cases](../2026-07-19-ios-domain-models-value-objects-invariants-use-cases/)
- Next: [Part 65: Coordinators, routers, deep links, and restoration](../2026-07-19-ios-coordinators-routers-deep-links-restoration/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Swift packages](https://www.swift.org/documentation/package-manager/) describes package and module composition boundaries.
- [SwiftUI model data](https://developer.apple.com/documentation/swiftui/model-data) covers dependency and observable data flow in SwiftUI.

## Related topics

- [Swift protocols and protocol-oriented design](../2026-07-16-swift-protocols-extensions-protocol-oriented-design/)
- [Architecture starts with pressure](../2026-07-19-ios-architecture-starts-with-pressure/)
