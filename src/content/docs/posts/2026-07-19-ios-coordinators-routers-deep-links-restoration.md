---
title: Coordinators, routers, deep links, and restoration
description: "Translate one validated route model into SwiftUI and UIKit navigation while keeping navigation frameworks outside the domain."
date: 2026-07-19
tags: [ios, swift, architecture, navigation, deep-links, restoration, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-coordinators-routers-deep-links-restoration/
series:
  slug: zero-to-ios-hero
  order: 65
---

Navigation has two concerns. Product code decides which destination is meaningful; a UI adapter decides how that destination is presented with a stack, split view, tab, sheet, or controller transition.

## Parse external input into route intent

```swift
enum AppRoute: Hashable, Codable {
    case library
    case note(UUID)
    case edit(UUID)
    case settings
}

struct RouteParser {
    func parse(_ url: URL) -> AppRoute? {
        guard url.scheme == "fieldnotes", url.host == "note" else { return nil }
        let pieces = url.pathComponents.filter { $0 != "/" }
        guard let rawID = pieces.first, let id = UUID(uuidString: rawID) else {
            return nil
        }
        return pieces.dropFirst().first == "edit" ? .edit(id) : .note(id)
    }
}
```

Parsing does not navigate. The app first validates authorization and whether the note exists, then sends the route to the active UI adapter.

## Adapt the same route twice

SwiftUI can append values to a navigation path. A UIKit coordinator can choose a controller and push or present it. Both adapters accept `AppRoute`; neither asks the domain to import `NavigationPath` or `UINavigationController`.

Restoration serializes stable route identity, not controller objects or transient view state. On launch, resolve saved IDs against current data and fall back safely when content was deleted or access changed.

## Give ownership one home

A coordinator is useful when navigation crosses features, contains branching flows, or must work across compact and regular presentations. Local sheets can stay local when no shared policy exists. Do not create two competing route owners.

## Series navigation

- Previous: [Part 64: Dependency injection and the composition root](../2026-07-19-ios-dependency-injection-composition-root/)
- Next: [Part 66: Repositories, gateways, clients, and ports and adapters](../2026-07-19-ios-repositories-gateways-clients-ports-adapters/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Showing and hiding view controllers](https://developer.apple.com/documentation/uikit/showing-and-hiding-view-controllers) covers UIKit navigation and presentation.
- [NavigationStack](https://developer.apple.com/documentation/swiftui/navigationstack) provides data-driven stack navigation in SwiftUI.

## Related topics

- [Information architecture and navigation](../2026-07-19-ios-information-architecture-navigation/)
- [SwiftUI navigation, presentation, alerts, and deep links](../2026-07-19-swiftui-navigation-presentation-alerts-deep-links/)
