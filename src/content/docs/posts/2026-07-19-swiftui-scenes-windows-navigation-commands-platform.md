---
title: SwiftUI scenes, windows, navigation, and commands
description: "Give each window coherent state, adapt navigation to available space, and expose system commands without assuming an iPhone-shaped app."
date: 2026-07-19
tags: [ios, swift, swiftui, scenes, windows]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-scenes-windows-navigation-commands-platform/
series:
  slug: zero-to-ios-hero
  order: 42
---

A scene is a system-managed presentation of part of the app. One process can own several windows, each with different navigation, selection, size, and lifecycle state.

## Separate shared data from window state

```swift
@main
struct FieldNotesApp: App {
    @State private var library = NoteLibraryModel()

    var body: some Scene {
        WindowGroup {
            NotesScene(library: library)
        }

        WindowGroup("Note", for: NoteID.self) { $noteID in
            NoteWindow(library: library, noteID: noteID)
        }
    }
}
```

The library is shared application data. Each `NotesScene` owns its own selection, route path, search query, and draft presentation. Putting all navigation in one global object makes two windows fight over one path.

## Open a focused window by value

```swift
@Environment(\.openWindow) private var openWindow

Button("Open in New Window") {
    openWindow(value: note.id)
}
```

The system decides window placement and restoration. The destination still handles a missing or deleted note.

## Adapt navigation from available presentation

`NavigationSplitView` can show sidebar, content, and detail where space permits, then collapse for compact presentation. Keep the selected note and route intent independent from the number of visible columns.

```text
compact: list -> detail
regular: sidebar | list | detail
```

Do not branch on device model. iPad windows resize, external displays differ, and platform idioms evolve.

## Put commands on application actions

```swift
.commands {
    CommandGroup(after: .newItem) {
        Button("New Note") { library.beginNewNote() }
            .keyboardShortcut("n", modifiers: .command)
    }
}
```

Menu and keyboard actions call the same application command as visible controls. Disabled state and focused-window context need to match the current scene.

## Respond to lifecycle without assuming termination

Scene phase can prompt bounded work such as committing an already-valid draft or refreshing stale data. It is not a promise of background execution. Save durable work before suspension and make repeated callbacks idempotent.

## Validation boundary

Multiwindow APIs, commands, split-view collapse, scene restoration, lifecycle transitions, and platform-specific behavior were not compiled or run. They remain Not verified until tested with supported Xcode destinations.

## Series navigation

- Previous: [Part 41: SwiftUI animation, gestures, drag and drop, and drawing](../2026-07-19-swiftui-animation-transitions-gestures-drag-drop-drawing/)
- Next: [Part 43: SwiftUI previews, tests, accessibility, and performance](../2026-07-19-swiftui-previews-testing-ui-accessibility-performance/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Scenes](https://developer.apple.com/documentation/swiftui/scenes) covers system-managed interface instances.
- [Bringing multiple windows to your SwiftUI app](https://developer.apple.com/documentation/swiftui/bringing-multiple-windows-to-your-swiftui-app) covers value-driven windows.
- [Commands](https://developer.apple.com/documentation/swiftui/commands) supplies menu and keyboard command groups.

## Related topics

- [Adaptive design for iPhone, iPad, and windows](../2026-07-19-ios-adaptive-design-iphone-ipad-windows/)
- [Navigation, presentation, alerts, and deep links](../2026-07-19-swiftui-navigation-presentation-alerts-deep-links/)
