---
title: SwiftUI lists, grids, scrolling, search, selection, and refresh
description: "Render changing note collections with stable identity, one data pipeline, search, selection, and refresh behavior."
date: 2026-07-19
tags: [ios, swift, swiftui, lists, search]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-lists-grids-scrolling-search-selection-refresh/
series:
  slug: zero-to-ios-hero
  order: 37
---

A collection view is the final stage of a data pipeline. Search, filtering, sorting, grouping, and selection should agree on one set of stable domain identities.

## Derive the visible notes once

```swift
struct NoteBrowser: View {
    let notes: [FieldNote]
    @State private var query = ""
    @State private var favoritesOnly = false
    @State private var selection: Set<FieldNote.ID> = []

    private var visibleNotes: [FieldNote] {
        notes
            .filter { !favoritesOnly || $0.isFavorite }
            .filter { note in
                query.isEmpty || note.title.localizedStandardContains(query)
            }
            .sorted { $0.updatedAt > $1.updatedAt }
    }

    var body: some View {
        List(visibleNotes, selection: $selection) { note in
            NoteRow(note: note)
                .tag(note.id)
        }
        .searchable(text: $query, prompt: "Search notes")
    }
}
```

Compute the pipeline outside each row. For a large catalog or expensive search, move indexing and transformation into a model, then measure before adding caches.

## Stable identity protects continuity

`FieldNote.ID` survives filtering and sorting. An array offset does not. Offset identity can move row state, selection, focus, and animations to another note after insertion.

Selection also needs cleanup when notes disappear. Decide whether deleting a selected note clears selection, chooses a neighbor, or preserves a tombstone for undo.

## Choose list or grid from the content

`List` supplies platform behavior for rows, selection, swipe actions, and editing. `LazyVGrid` fits card collections and adaptive columns. Both still need semantic reading order and accessible actions.

```swift
LazyVGrid(columns: [GridItem(.adaptive(minimum: 180))]) {
    ForEach(visibleNotes) { note in
        NavigationLink(value: note.id) {
            NoteCard(note: note)
        }
    }
}
```

Do not switch solely because an iPad is detected. Let available width and the task determine presentation.

## Make scrolling intentional

Programmatic scrolling should target stable IDs and respond to a user goal, such as revealing a newly created note. Avoid fighting manual scrolling on every model update.

Preserving scroll position across filtering, navigation, and restoration needs product rules. A deep link may intentionally move to one note. A background refresh should usually preserve the person's place.

## Refresh without erasing useful content

```swift
List(model.visibleNotes) { note in
    NoteRow(note: note)
}
.refreshable {
    await model.refresh()
}
```

Refresh is an event, not a complete state model. Keep existing notes visible while checking for newer data when possible. Expose stale, offline, failure, and retry states without replacing usable content with a blank spinner.

The refresh method must observe cancellation and coalesce or reject duplicate work according to an explicit contract.

## Empty results have different causes

Distinguish:

- the library has no notes
- search found no matches
- filters excluded every note
- loading has not completed
- loading failed

Each state needs different copy and recovery. “No notes” with a Create action is wrong when clearing the search would reveal fifty notes.

## Validation boundary

The snippets were not compiled or performance-tested. List behavior, search localization, selection across size classes, scrolling continuity, refresh cancellation, and accessibility remain Not verified.

## Series navigation

- Previous: [Part 36: SwiftUI Observation, environment, and dependency flow](../2026-07-19-swiftui-observation-environment-dependency-flow/)
- Next: [Part 38: SwiftUI navigation, presentation, alerts, and deep links](../2026-07-19-swiftui-navigation-presentation-alerts-deep-links/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [List](https://developer.apple.com/documentation/swiftui/list) provides structured, selectable collections.
- [Adding a search interface to your app](https://developer.apple.com/documentation/swiftui/adding-a-search-interface-to-your-app) covers searchable content.
- [RefreshAction](https://developer.apple.com/documentation/swiftui/refreshaction) represents refresh behavior supplied through the environment.
