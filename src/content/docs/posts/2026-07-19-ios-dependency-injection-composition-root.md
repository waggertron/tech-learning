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

The composition root is the startup location that chooses concrete collaborators. Field Notes has two interfaces and one repository contract, so choosing storage once prevents the frameworks from implementing different product rules.

## Construct the application from the outside

Both apps call the same `AppComposition.library()` factory in `Apps/Shared/AppComposition.swift`:

```swift
let repository = FileNoteRepository(url: url)
let library = NoteLibrary(repository: repository)
```

`url` is resolved in Application Support before constructing the repository. SwiftUI passes the library into `NoteListModel`; UIKit passes it into `NoteListViewController`. Both eventually call the same `SaveNote` operation.

```text
Application Support URL
          |
          v
FileNoteRepository -> NoteLibrary -> SwiftUI model or UIKit controller
```

The file adapter is an actor. The app creates one writer for one file and shares it through the library value. Constructing two live file actors for the same URL would create independent serialization domains, so this implementation does not promise cross-process or multiple-writer coordination.

## Substitute the contract in tests

```swift
let repository = InMemoryNoteRepository()
let save = SaveNote(
    library: NoteLibrary(repository: repository),
    now: { Date(timeIntervalSince1970: 1_700_000_000) }
)
let draft = NoteDraft(title: "Creek", id: NoteID(rawValue: "test-note"))
let note = try await save(draft)
```

The same `SaveNote` runs against memory or disk. Tests do not switch behavior inside the use case. The shared repository contract covers replacement, idempotent deletion, search, ordering, and value round trips.

## Keep test configuration at startup

Debug UI tests pass `--ui-testing`, `--store-name`, and optionally `--reset-store` or `--fail-first-save`. Only the composition factory interprets those arguments. A failed-save fixture wraps the selected file repository and rejects its first write, then forwards retries.

The test store name permits only letters, digits, and hyphens. Production startup does not accept an arbitrary path from launch arguments. If the Application Support directory cannot be resolved, the factory supplies an unavailable repository so the interface exposes a recoverable failure instead of deleting data or trapping.

## Match the evidence to the layer

Package contracts passed with Swift 6.3.3. The two app entry points and test drivers have syntax-check evidence only. Xcode target compilation, startup configuration, Simulator journeys, and device accessibility remain unverified. Dependency injection makes those checks easier to isolate; it does not replace them.

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
