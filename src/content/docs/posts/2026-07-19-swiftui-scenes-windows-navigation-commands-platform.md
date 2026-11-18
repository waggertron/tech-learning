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

A scene is a system-managed presentation. The initial Field Notes application uses one `WindowGroup`; its composition root shares the library while each list view owns its editor presentation.

## Start with the actual app entry point

```swift
@main
struct FieldNotesSwiftUIApp: App {
    @State private var model = NoteListModel(library: AppComposition.library())

    var body: some Scene {
        WindowGroup { NoteListView(model: model) }
    }
}
```

`AppComposition` selects the repository. `NoteListModel` owns committed collection data and the current search. `NoteListView` owns the optional new-note draft, so presenting an editor does not mutate durable storage.

## Separate future window state from shared data

The current model's search is shared with its instance. Adding multiple independent windows would require moving search, route selection, and drafts into per-window state while sharing only the library and committed-data coordination.

```text
shared repository and application operations
                 |
        +--------+--------+
        |                 |
window A state       window B state
query, selection     query, selection
editor draft         editor draft
```

Without that split, changing a search in one window could change another window. A shared observable object is a lifetime choice, not a free multiwindow architecture.

## Route commands through the same operations

A future menu command for New Note would create a draft in the focused window, just as its toolbar button does. A command to save would call the same guarded save operation as the editor. The command's enabled state follows the focused window's valid draft and in-flight operation.

Scene phase can request bounded refresh. It is not a promise that work will continue after suspension. Committed notes are already on disk before the editor dismisses. Unsaved draft restoration remains outside this slice.

## Evidence boundary

The companion supplies a single-window app source, not an implemented document/window product. Multiwindow restoration, command routing, split-view adaptation, and platform-specific behavior remain unverified. The next capstone uses the supported bounded local loop rather than claiming those extensions are complete.

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
