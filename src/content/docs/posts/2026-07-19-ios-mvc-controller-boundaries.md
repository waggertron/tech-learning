---
title: MVC and controller boundaries
description: "Keep UIKit controllers focused on lifecycle and event routing by extracting formatting and validation into ordinary Swift types."
date: 2026-07-19
tags: [ios, swift, architecture, mvc, uikit, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-mvc-controller-boundaries/
series:
  slug: zero-to-ios-hero
  order: 60
---

Cocoa MVC assigns views to presentation, models to application meaning, and controllers to coordination between them. The controller becomes massive when every task that does not obviously fit a view or persistence model lands there.

## Keep the controller at the framework boundary

A view controller has legitimate UIKit work: install views, respond to lifecycle callbacks, translate control events, present navigation, and render the latest state. Text normalization and note validation do not require UIKit.

```swift
struct NoteDraft {
    var title: String
    var body: String
}

struct NoteDraftValidator {
    func validated(_ draft: NoteDraft) throws -> NoteDraft {
        let title = draft.title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !title.isEmpty else { throw ValidationError.missingTitle }
        return NoteDraft(title: title, body: draft.body)
    }
}
```

The controller gathers input, calls the validator, and renders success or failure. It does not need a new architectural layer merely to call this value.

## Extract by reason to change

Move behavior when it has a distinct reason to change or a cheaper proof surface:

- formatting rules belong in a formatter or presentation value
- business invariants belong in domain values or use cases
- storage and networking belong behind application contracts
- view hierarchy, focus, and presentation remain in the controller

An extension can organize a long file, but it does not create a boundary. A renamed controller with the same dependencies is still massive.

## Test the extracted rule directly

`NoteDraftValidator` can be tested without a scene, view hierarchy, or main run loop. Controller tests should then cover the smaller contract: intent enters, a dependency is called, and the correct state is rendered.

## Series navigation

- Previous: [Part 59: Architecture starts with pressure](../2026-07-19-ios-architecture-starts-with-pressure/)
- Next: [Part 61: MVVM and presentation models](../2026-07-19-ios-mvvm-presentation-models/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [View controllers](https://developer.apple.com/documentation/uikit/view-controllers) describes UIKit controller responsibilities and containment.
- [The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/) covers the value types used to isolate framework-neutral behavior.

## Related topics

- [UIKit view-controller lifecycle and containment](../2026-07-19-uikit-view-controller-lifecycle-containment-composition/)
- [Architecture starts with pressure](../2026-07-19-ios-architecture-starts-with-pressure/)
