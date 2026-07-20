---
title: UIKit navigation, tabs, split views, and coordinators
description: "Translate shared route intent into navigation and split-view containers while keeping controller presentation ownership explicit."
date: 2026-07-19
tags: [ios, swift, uikit, navigation, coordinators]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-navigation-tabs-split-views-coordinators/
series:
  slug: zero-to-ios-hero
  order: 49
---

UIKit container controllers own navigation structure. A coordinator becomes useful when several screens or entry points need one route policy.

## Route by intent

```swift
enum Route {
    case note(NoteID)
    case settings
}

@MainActor
final class NotesCoordinator {
    private let navigationController: UINavigationController
    private let library: NoteLibrary

    func open(_ route: Route) {
        switch route {
        case .note(let id):
            navigationController.pushViewController(
                NoteDetailViewController(noteID: id, library: library),
                animated: true
            )
        case .settings:
            navigationController.pushViewController(SettingsViewController(), animated: true)
        }
    }
}
```

Rows emit `open(.note(id))`. They do not search globally for a visible controller. The coordinator owns UIKit mechanics while the route remains framework-neutral.

## Adapt one selection model

On a compact phone, selecting a note pushes detail. In a regular split view, the same selection replaces the secondary column. Collapse and expansion reconcile current selection instead of inventing a second navigation truth.

Tabs represent a few peer destinations with durable meaning. They are not a storage place for every feature. Each tab commonly owns its own navigation stack so switching tabs does not discard local history.

## Restore and deep link safely

Parse external input into a route, validate the note against current data, then ask the active scene coordinator to present it. Restoration uses stable IDs and drops invalid destinations without crashing.

Do not add a coordinator for one trivial modal. Add it when navigation spans screens, adapts across containers, or serves deep links and restoration.

## Validation boundary

The examples were not compiled. Push and pop behavior, split collapse, tab state, coordinator ownership, deep links, and restoration remain Not verified.

## Series navigation

- Previous: [Part 48: UIKit view-controller lifecycle and containment](../2026-07-19-uikit-view-controller-lifecycle-containment-composition/)
- Next: [Part 50: UIKit sheets, popovers, alerts, activities, and pickers](../2026-07-19-uikit-sheets-popovers-alerts-activities-system-pickers/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [UINavigationController](https://developer.apple.com/documentation/uikit/uinavigationcontroller) owns stack navigation.
- [UISplitViewController](https://developer.apple.com/documentation/uikit/uisplitviewcontroller) owns adaptive column navigation.
- [UITabBarController](https://developer.apple.com/documentation/uikit/uitabbarcontroller) manages peer destinations.

## Related topics

- [Information architecture and navigation](../2026-07-19-ios-information-architecture-navigation/)
- [SwiftUI navigation, presentation, alerts, and deep links](../2026-07-19-swiftui-navigation-presentation-alerts-deep-links/)
