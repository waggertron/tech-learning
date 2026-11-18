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

Navigation presents intent. The current app opens detail by stable note ID and presents a temporary draft for editing. Parsing an external URL is a separate boundary from registering or delivering that URL.

## Push a detail that resolves current data

The actual list uses this composition:

```swift
NavigationLink {
    NoteDetailScreen(id: note.id, model: model)
} label: {
    NoteRow(note: note)
}
```

`NoteDetailScreen` resolves `id` against `model.notes`. If the note no longer exists, it shows Note Unavailable. It does not retain an independent mutable copy of committed data. Updating a note preserves its identity, so the same destination can render the replacement.

The implementation lives with `NoteListView` and `NoteDetailScreen` in `Apps/SwiftUI/FieldNotesSwiftUIApp.swift`. `NoteRow` is defined in `NoteComponents.swift`.

## Present one draft at a time

```swift
@State private var newDraft: NoteDraft?

// Inside the view's toolbar:
Button("New Note", systemImage: "plus") {
    newDraft = NoteDraft()
}

// On the presenting view:
.sheet(item: $newDraft) { draft in
    NoteEditorScreen(draft: draft, save: model.save)
}
```

The optional draft is both the presentation fact and the identity of the editing task. There is no independent `showsEditor` Boolean that can disagree with it. The editor owns a local draft copy; Cancel dismisses without committing it. A successful save dismisses only after the repository acknowledges the write.

Deletion uses an explicit confirmation. The detail calls the application delete operation, waits for success, then returns to a valid collection. A failed delete leaves the note visible and shows recovery.

## Parse an external route without pretending delivery works

The complete parser in `FieldNotesCore/NoteRoute.swift` is:

```swift
import Foundation

/// Parsing is testable without registering a URL scheme or claiming universal-link delivery.
public enum NoteRoute: Equatable, Sendable {
    case note(NoteID)

    public init?(url: URL) {
        guard url.scheme == "fieldnotes", url.host == "note",
              url.pathComponents.count == 2,
              let rawID = url.pathComponents.last, !rawID.isEmpty else { return nil }
        self = .note(NoteID(rawValue: rawID))
    }
}
```

The package tests accept a valid note route and reject the wrong scheme, host, missing ID, and extra path components. A `NoteID` initializer is non-failable; syntax checks belong before constructing it. The parser alone cannot prove that the note exists.

The app does not register this custom scheme yet. A full integration would register the handler, parse at `.onOpenURL`, resolve the ID, and route into the correct window. Universal links additionally require a hosted association file and signed installation. None of those follows from a passing parser test.

## Keep restoration separate from persistence

Committed notes survive relaunch through the file adapter. The current app does not promise restoring an open detail, unsaved draft, or navigation path. Those require explicit encoding, reconciliation against current notes, and a policy for missing destinations.

The parser package tests passed on Swift 6.3.3. App source was syntax-parsed, but navigation transitions, sheets, confirmations, restoration, URL delivery, and Simulator behavior remain unverified until the Apple targets run.

## Series navigation

- Previous: [Part 37: SwiftUI lists, grids, scrolling, search, selection, and refresh](../2026-07-19-swiftui-lists-grids-scrolling-search-selection-refresh/)
- Next: [Part 39: SwiftUI async work, loading states, networking, and images](../2026-07-19-swiftui-async-loading-networking-images/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [NavigationStack](https://developer.apple.com/documentation/swiftui/navigationstack) manages a root and pushed destinations.
- [Migrating to new navigation types](https://developer.apple.com/documentation/swiftui/migrating-to-new-navigation-types) covers data-driven navigation.
- [Allowing apps and websites to link to your content](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content) covers the universal-link setup boundary.
