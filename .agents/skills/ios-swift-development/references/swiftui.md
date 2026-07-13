# SwiftUI Reference

Reviewed on 2026-07-13. Use for SwiftUI planning, implementation, review, testing, and interoperability.

## Mental Model

- A `View` value describes UI for the current inputs. It is not a long-lived screen object.
- State persists because SwiftUI owns storage tied to identity, not because one view value survives.
- Data dependencies drive updates. Keep the source of truth at the narrowest owner that needs to mutate it.
- Stable identity matters in lists, navigation, focus, animations, tasks, and state preservation.
- Layout is a proposal and response process. Avoid fixed frames copied from one simulator screenshot.

## State Ownership

- Use plain stored properties for immutable input.
- Use `@State` for local value state and owned Observation models.
- Use bindings when a child edits state owned elsewhere.
- Use environment values for shared contextual dependencies with a clear scope.
- Keep derived values computed from source state unless caching has a measured benefit.
- Keep domain rules and external-service orchestration outside `body` and view modifiers.

## Review Checklist

- Verify list and navigation identity uses stable domain identifiers, not array offsets.
- Treat user-authored strings as data rather than localization keys, for example with `Text(verbatim:)` where that distinction matters.
- Verify tasks have intentional lifetime, cancellation, and actor isolation.
- Verify sheets, alerts, navigation destinations, and focus bind to one coherent state model.
- Verify loading, empty, error, offline, permission-denied, and cancellation states where reachable.
- Verify large text, VoiceOver labels and order, Voice Control names, reduced motion, contrast, keyboard input, right-to-left layout, and localization.
- Verify adaptive navigation and layouts on compact iPhone and iPad destinations.
- Verify every API newer than the deployment floor has an availability plan.

## Testing

- Test domain and formatting behavior without rendering views.
- Use previews for fast visual state coverage, not as automated proof.
- Use focused UI tests for user-critical flows, navigation wiring, accessibility identifiers, and system integration.
- Keep preview and test dependencies local, deterministic, and safe to reset.

## Interoperability

- Wrap UIKit views with representables when a mature or specialized control has no suitable SwiftUI equivalent.
- Host SwiftUI in UIKit when incremental adoption or existing navigation ownership calls for it.
- Define the ownership boundary for navigation, presentation, data flow, and lifecycle before mixing frameworks.

## Primary Sources

- [SwiftUI framework overview](https://developer.apple.com/documentation/swiftui/)
- [App organization](https://developer.apple.com/documentation/swiftui/app-organization)
- [Model data](https://developer.apple.com/documentation/swiftui/model-data)
- [SwiftUI accessibility fundamentals](https://developer.apple.com/documentation/swiftui/accessibility-fundamentals)
- [UIKit integration](https://developer.apple.com/documentation/swiftui/uikit-integration)
