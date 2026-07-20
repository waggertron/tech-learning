---
title: Modularization with Swift Package Manager
description: "Extract domain, application, and selected adapters into modules only when dependency, ownership, reuse, or build pressure earns the split."
date: 2026-07-19
tags: [ios, swift, architecture, modularization, swift-package-manager, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-modularization-swift-package-manager/
series:
  slug: zero-to-ios-hero
  order: 67
---

A module is a compiler-enforced dependency boundary. It can protect core behavior from UI and storage frameworks, but every module adds manifests, public API decisions, build graph edges, and coordination cost.

## Start with an inward graph

```text
FieldNotesSwiftUI ----+
                      |
FieldNotesUIKit ------+--> FieldNotesApplication --> FieldNotesDomain
                      |
SwiftDataAdapter -----+
```

The domain target imports no Apple UI, database, or network framework. The application target owns use cases and ports. App targets compose selected adapters.

```swift
// Package.swift excerpt
.target(name: "FieldNotesDomain"),
.target(
    name: "FieldNotesApplication",
    dependencies: ["FieldNotesDomain"]
),
.target(
    name: "FieldNotesPersistence",
    dependencies: ["FieldNotesApplication", "FieldNotesDomain"]
)
```

## Extract along stable seams

Useful signals include reuse by two app targets, independent ownership, slow incremental builds, a dangerous dependency that should not spread, or a core that needs command-line tests. A folder can express organization before a package is justified.

## Design the public surface

Moving code into a package forces access-control choices. Export use cases and domain values that clients need, not internal helpers or database shapes. Avoid a catch-all shared module that becomes a new global namespace.

Do not start with dozens of feature and utility packages. Measure build time and coordination, then split the dependency graph where a concrete outcome improves.

## Series navigation

- Previous: [Part 66: Repositories, gateways, clients, and ports and adapters](../2026-07-19-ios-repositories-gateways-clients-ports-adapters/)
- Next: [Part 68: Data architecture, source of truth, caching, offline sync, and conflict](../2026-07-19-ios-data-architecture-source-truth-cache-offline-sync-conflict/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Swift Package Manager](https://www.swift.org/documentation/package-manager/) documents package products, targets, dependencies, and builds.
- [Access control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/) defines Swift module visibility.

## Related topics

- [Swift modules, packages, and API design](../2026-07-19-swift-modules-packages-access-control-interoperability-api-design/)
- [Dependency injection and the composition root](../2026-07-19-ios-dependency-injection-composition-root/)
