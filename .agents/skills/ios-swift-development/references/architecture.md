# Apple App Architecture Reference

Use this reference for Field Notes and case-study architecture. Start from product behavior, then add only the boundaries that protect meaningful rules or unstable external systems.

## Dependency Direction

```text
SwiftUI / UIKit / widgets / intents / tests
                    |
                    v
          Application use cases
                    |
                    v
        Domain models and policies
                    ^
                    |
 SwiftData / files / URLSession / CloudKit
 clocks / IDs / notifications / device services
```

The domain imports no UI, persistence, network, cloud, or operating-system framework. Application code owns the ports it needs. Adapters translate framework data into application and domain types. A composition root wires the app.

## Add a Boundary When

- A domain rule needs fast tests without Xcode, UI, storage, or network setup.
- SwiftUI and UIKit need to exercise the same use case.
- A real service needs a local implementation.
- Framework types would otherwise spread through core behavior.
- Cancellation, retry, transaction, authorization, or idempotency policy needs one owner.

## Keep It Direct When

- The feature is simple CRUD with no meaningful rule to isolate.
- A wrapper only renames one call and has no second implementation or testing value.
- Framework conventions already give the needed lifecycle and test seam.
- The team cannot yet name the use case or domain boundary.

## Field Notes Core

- **Domain**: Note, tag, attachment metadata, location value, search query, and validation rules.
- **Application**: Create, edit, delete, favorite, search, attach media, record location, import, export, and sync use cases.
- **Outbound ports**: Note repository, attachment store, search index, clock, identifier source, location provider, and sync service.
- **Driving adapters**: SwiftUI screens, UIKit view controllers, widgets, intents, import handlers, and tests.
- **Driven adapters**: In-memory store, file store, SwiftData, URLSession client, CloudKit, Core Location, and notification scheduling.
- **Composition**: App target selects local or production adapters and injects them into use cases.

## Local First Contract

- Provide an in-memory or filesystem adapter before a cloud adapter.
- Keep local and production providers behind the same purposeful contract.
- Preserve validation, ordering, identity, and read-after-write behavior in local providers.
- Reject unsupported local operations instead of silently doing nothing.
- Clean temporary data after automated runs and give manual fixtures an explicit reset path.

## Testing

- Test domain policies with real values and no mocks.
- Test use cases with in-memory adapters.
- Test adapters against their contract using temporary local state where possible.
- Use end-to-end tests for composition and critical flows, not every rule.

## Research Anchors

- [Swift packages](https://www.swift.org/documentation/package-manager/)
- [SwiftUI model data](https://developer.apple.com/documentation/swiftui/model-data)
- [Modeling data with SwiftData](https://developer.apple.com/documentation/swiftdata/modeling-data)
- [URLSession](https://developer.apple.com/documentation/foundation/urlsession)
- [CloudKit](https://developer.apple.com/documentation/cloudkit)
