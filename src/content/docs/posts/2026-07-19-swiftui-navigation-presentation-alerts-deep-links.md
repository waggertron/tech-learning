---
title: SwiftUI navigation, presentation, alerts, and deep links
description: "Represent routes, sheets, alerts, and external note URLs as coherent data that can validate and restore."
date: 2026-07-19
tags: [ios, swift, swiftui, navigation, deep-links]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-navigation-presentation-alerts-deep-links/
series:
  slug: zero-to-ios-hero
  order: 38
---

Navigation is application state with a visual presentation. Model destinations as data and the interface can validate deep links, restore context, and adapt between stack and split layouts.

## Define routes with domain identity

```swift
enum Route: Hashable {
    case note(FieldNote.ID)
    case settings
}

struct RootView: View {
    @State private var path: [Route] = []

    var body: some View {
        NavigationStack(path: $path) {
            NoteListView(open: { id in path.append(.note(id)) })
                .navigationDestination(for: Route.self) { route in
                    switch route {
                    case .note(let id): NoteDetailScreen(noteID: id)
                    case .settings: SettingsView()
                    }
                }
        }
    }
}
```

The path records intent, not whole mutable model objects. A destination resolves the ID against current data and can show a missing-note state.

## Model focused presentation

```swift
enum Sheet: Identifiable {
    case newNote
    case edit(FieldNote.ID)

    var id: String {
        switch self {
        case .newNote: "new"
        case .edit(let id): "edit-\(id)"
        }
    }
}

@State private var sheet: Sheet?
```

One optional value prevents several sheet Booleans from becoming true together. The item passed to `.sheet(item:)` also identifies the presented task.

Alerts benefit from the same approach:

```swift
struct DeleteRequest: Identifiable {
    let id: FieldNote.ID
    let title: String
}

@State private var deleteRequest: DeleteRequest?
```

The confirmation carries the exact note and copy needed for the decision. Confirm invokes one deletion path. Cancel clears the request without mutation.

## Parse deep links at a boundary

```swift
enum DeepLink {
    case note(FieldNote.ID)

    init?(url: URL) {
        guard url.scheme == "fieldnotes",
              url.host == "note",
              let rawID = url.pathComponents.dropFirst().first,
              let id = FieldNote.ID(rawValue: rawID) else { return nil }
        self = .note(id)
    }
}
```

Parsing validates syntax. Routing validates application state: does the note exist, may this user open it, and which window owns the request? Invalid or missing destinations need visible recovery.

Universal links also require associated domains, a hosted association file, signing, installation, and device testing. URL parsing alone does not prove them.

## Restore durable route state carefully

Routes can be encoded for restoration when their values are stable. On restore, reconcile them against current notes and permissions. Drop or replace invalid destinations rather than crashing or manufacturing stale objects.

Compact and regular layouts may present the same selection differently. Keep the route or selection model shared while adapters choose stack, column, sheet, or window presentation.

## Avoid navigation ownership leaks

Leaf rows can emit intent such as `open(note.id)`. They should not locate a global navigator and mutate arbitrary paths. Keeping route mutation at a feature boundary makes previews and tests smaller.

## Validation boundary

The route examples were not compiled. Navigation transitions, sheet and alert presentation, state restoration, universal-link association, Simulator routing, signing, and physical-device delivery remain Not verified.

## Series navigation

- Previous: [Part 37: SwiftUI lists, grids, scrolling, search, selection, and refresh](../2026-07-19-swiftui-lists-grids-scrolling-search-selection-refresh/)
- Next: [Part 39: SwiftUI async work, loading states, networking, and images](../2026-07-19-swiftui-async-loading-networking-images/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [NavigationStack](https://developer.apple.com/documentation/swiftui/navigationstack) manages a root and pushed destinations.
- [Migrating to new navigation types](https://developer.apple.com/documentation/swiftui/migrating-to-new-navigation-types) covers data-driven navigation.
- [Allowing apps and websites to link to your content](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content) covers the universal-link setup boundary.
