# UIKit Reference

Reviewed on 2026-07-13. Use for UIKit planning, implementation, review, testing, and SwiftUI interoperability.

## Mental Model

- UIKit uses long-lived objects with explicit lifecycle callbacks, mutable view hierarchies, delegates, targets, actions, and data sources.
- A view controller owns one screen or contained region of UI behavior. It coordinates views and application actions without becoming the domain model.
- Navigation controllers, tab bar controllers, split view controllers, presentation controllers, and child containment own structural relationships.
- Auto Layout expresses relationships. Trait collections and safe areas adapt those relationships to the current environment.

## Implementation Rules

- Build view hierarchies in one clear place and keep configuration idempotent.
- Use Auto Layout or an intentional layout callback for resizable view hierarchies. Do not assign one initial frame and assume it survives rotation, split view, or window resizing.
- Register reusable table and collection cells, then dequeue them for each index path. Do not allocate a new cell for every data-source request.
- Use modern collection and table APIs with stable item identifiers. Diffable data sources do not discover model changes for the app.
- Keep cell registration closures small. Retrieve current model data by stable identifier.
- Contain child view controllers with the complete parent, child, and view lifecycle sequence.
- Use coordinators or routers when navigation logic spans several screens or entry points. Do not add a coordinator for one trivial presentation.
- Make delegate ownership and closure capture explicit. Review long-lived closures for retain cycles.
- Keep main-thread UI mutation visible through `MainActor` when using Swift concurrency.

## Review Checklist

- Verify lifecycle work is placed in the callback whose repeat behavior matches the need.
- Verify constraints are complete without hard-coding one screen size.
- Verify reusable cells reset transient state and cancel obsolete asynchronous work.
- Verify diffable identifiers are stable and equality matches identity.
- Verify state restoration, deep links, multiple scenes, memory pressure, and background transitions where relevant.
- Verify accessibility elements, labels, traits, custom actions, Dynamic Type, focus, keyboard use, contrast, motion, localization, and right-to-left layout.
- Verify permission denial and settings-return flows do not assume the app restarts.

## Testing

- Test controllers with injected use cases and local adapters where a fast object-level test provides value.
- Use UI tests for navigation, presentation, responder behavior, accessibility, and system-owned surfaces.
- Keep collection snapshots and fixtures deterministic so order and identity failures are reproducible.

## Interoperability

- Use `UIHostingController` to embed SwiftUI under UIKit navigation or containment.
- Use representables to expose UIKit controls to SwiftUI.
- Assign one framework as the owner of each navigation or presentation boundary.

## Primary Sources

- [UIKit framework overview](https://developer.apple.com/documentation/uikit)
- [Displaying and managing views with a view controller](https://developer.apple.com/documentation/uikit/displaying-and-managing-views-with-a-view-controller)
- [Modern collection views](https://developer.apple.com/documentation/uikit/implementing-modern-collection-views)
- [Updating collection views with diffable data sources](https://developer.apple.com/documentation/uikit/updating-collection-views-using-diffable-data-sources)
- [SwiftUI integration](https://developer.apple.com/documentation/uikit/swiftui-integration)
