---
title: Information architecture and navigation
description: "Organize Field Notes around notes, places, search, editing, and settings, then map those objects into compact and regular navigation without losing selection."
date: 2026-07-19
tags: [ios, product-design, information-architecture, navigation, adaptive-design]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-information-architecture-navigation/
series:
  slug: zero-to-ios-hero
  order: 26
---

Information architecture decides what things exist in the product, how they relate, and where people expect to find them. Navigation is the mechanism for moving through that structure.

Starting from database tables produces storage-shaped interfaces. Start from the objects and tasks people recognize: notes, places, search results, editing, and preferences.

## Build a content model

Field Notes has one primary object, a note:

```text
Note
├── identity
├── title and body
├── tags
├── created and updated time
├── favorite state
├── optional location
└── optional attachments
```

Places and tags are facets over notes, not independent content silos in the first release. Search is a way to retrieve notes. Settings configure behavior. The editor changes an existing or new note.

This distinction prevents every attribute from becoming a permanent tab.

## Define destinations

Use a small route vocabulary:

| Destination | Purpose |
| --- | --- |
| library | browse recent or filtered notes |
| search | retrieve notes by text and facets |
| places | browse notes with location context |
| note detail | read one note |
| editor | create or edit one note |
| settings | configure application behavior |

Creation and editing are tasks entered from context. They do not need to compete with library and search as equal top-level destinations.

## Draw the route graph

```text
                         +-> settings
                         |
library -> note detail --+-> editor
   |          ^          |
   |          |          +-> place context
   v          |
 search ------+
   |
   v
 filtered library

places -> place results -> note detail
```

Arrows represent meaningful transitions, not every possible back gesture. Note detail is shared by library, search, and places. Returning should preserve the originating query, scroll position, and selection where the platform container supports it.

## Compact layout uses depth

On a compact width, a navigation stack can present:

```text
Library
  -> Note detail
       -> Editor
```

Search can live as a first-class library capability when it primarily filters notes. A separate search destination is justified when search has its own history, suggestions, scopes, or cross-domain results.

Modal presentation fits a bounded task such as creating a note, but presentation style does not define data ownership. Dismissing the editor needs an explicit changed-draft policy.

## Regular layout preserves context

A regular-width layout can show collection and detail together:

```text
+----------------------+----------------------------------+
| Library              | Selected note                    |
| Search               |                                  |
| Places               | Title                            |
| Settings             | Body, tags, place, attachments   |
|                      |                                  |
+----------------------+----------------------------------+
```

The same selected note identity should survive layout changes. Do not model phone and tablet as unrelated applications. Model destinations and selection once, then choose a presentation for available space.

An empty detail column needs useful content such as "Select a note," not an arbitrary first record that changes user selection.

## Tabs represent peer destinations

A tab bar works when destinations are important, frequent, and at the same hierarchy level. It is not a drawer for every feature.

For the first release, Library and Places may be peers if field research proves place browsing is frequent. Settings rarely deserves a primary tab. Search can integrate with Library until its task becomes distinct.

Keep tab identity stable. Pushing detail inside a tab preserves the person's location when switching between peers.

## Navigation state is application state

Represent destinations with typed values rather than scattering string identifiers:

```swift
enum Destination: Hashable {
    case note(NoteID)
    case editor(NoteID?)
    case settings
}

struct NavigationState: Equatable {
    var path: [Destination] = []
    var selectedNote: NoteID?
    var query = ""
}
```

The exact SwiftUI or UIKit adapter comes later. The model already exposes restoration, deep-link, and layout-transition requirements.

Do not store whole mutable note objects in the navigation path. Store stable identity, then resolve current data through the application boundary.

## Preserve context across transitions

Navigation quality depends on what survives:

- query and filter state after reading a result
- scroll position when returning to a long library
- selected note across compact and regular layouts
- unsaved draft when a scene becomes inactive
- accessible focus after dismissal or deletion

Back must return to the prior context, not reconstruct a vaguely similar screen.

## Deep links enter the same graph

A deep link to a note should resolve identity, handle missing or unauthorized content, and construct the same destination used by in-app navigation:

```text
incoming note ID
      |
      v
resolve current note
  |           |
found       missing
  |           |
detail     recoverable message
```

Do not create a second deep-link-only screen tree. One route model keeps restoration and testing tractable.

## Check your understanding

You should now be able to explain:

- Why storage entities do not automatically deserve destinations.
- Which Field Notes objects are primary and which are facets.
- How compact and regular layouts present the same route state.
- When a tab is justified.
- Why navigation paths store stable identity.

The next post turns each transition into an interaction contract with focus, progress, save feedback, deletion, undo, and error recovery.

## Series navigation

- Previous: [Part 25: User journeys, tasks, states, and edge cases](../2026-07-19-ios-user-journeys-tasks-states-edge-cases/)
- Next: [Part 27: Interaction design and feedback](../2026-07-19-ios-interaction-design-feedback/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- **Platform navigation patterns**: [Navigation and search](https://developer.apple.com/design/human-interface-guidelines/navigation-and-search) covers hierarchy, modality, search, and destination choice.
- **Adaptive containers**: [NavigationSplitView](https://developer.apple.com/documentation/swiftui/navigationsplitview) documents a SwiftUI container for multicolumn navigation.
- **UIKit hierarchy**: [UINavigationController](https://developer.apple.com/documentation/uikit/uinavigationcontroller) documents stack-based UIKit navigation.

## Related topics

- [User journeys, tasks, states, and edge cases](../2026-07-19-ios-user-journeys-tasks-states-edge-cases/), the tasks and state dimensions the route graph supports.
- [Enumerations, associated values, and pattern matching](../2026-07-16-swift-enumerations-associated-values-pattern-matching/), typed destination modeling.
- [Structures and value semantics](../2026-07-16-swift-structures-value-semantics/), stable navigation state snapshots.
