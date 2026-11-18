---
title: SwiftUI animation, gestures, drag and drop, and drawing
description: "Use state-driven motion, transitions, gesture precedence, transferable tags, and custom drawing without obscuring interaction."
date: 2026-07-19
tags: [ios, swift, swiftui, animation, gestures]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-animation-transitions-gestures-drag-drop-drawing/
series:
  slug: zero-to-ios-hero
  order: 41
---

Animation explains a state change; it does not perform the business operation. Field Notes persists a favorite change through `NoteLibrary` and then displays the resulting state.

## Animate a value after the operation succeeds

```swift
Button(note.isFavorite ? "Remove Favorite" : "Mark Favorite") {
    Task { await model.favorite(note) }
}
.animation(.default, value: note.isFavorite)
```

`FieldNote` is immutable. Calling `note.isFavorite.toggle()` is not a valid operation on the actual domain value. The application creates a replacement note, stores it, then reloads the visible collection. If persistence fails, the UI keeps the committed state and exposes the failure.

## Keep motion optional

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion

private var feedbackAnimation: Animation? {
    reduceMotion ? nil : .easeInOut(duration: 0.2)
}
```

A status label and accessible action carry the meaning even when animation is removed. A transition applies to insertion/removal; animating a persistent property is a different operation.

## Choose input alternatives before custom gestures

Native buttons and navigation links already define roles and activation. Before adding drag-and-drop reordering, define what moves, which IDs identify items, what cancellation means, and how a keyboard or accessibility action performs the same operation.

The current capstone does not implement tag reordering or custom drawing. Those are optional extensions rather than unfinished steps disguised as complete features. A useful extension would add one reorder command with invalid-ID and cancellation tests before attaching a gesture.

## Verify the interaction that matters

Package tests cover favorite replacement and failure. The current app source supplies native favorite controls. Reduced-motion animation, gesture precedence, accessibility activation, and device timing still require Apple-target checks. This page does not claim those checks passed.

## Series navigation

- Previous: [Part 40: SwiftUI with SwiftData, queries, migration, and test stores](../2026-07-19-swiftui-swiftdata-queries-relationships-migration-test-stores/)
- Next: [Part 42: SwiftUI scenes, windows, navigation, and commands](../2026-07-19-swiftui-scenes-windows-navigation-commands-platform/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Animations](https://developer.apple.com/documentation/swiftui/animations) covers state-driven animation.
- [Composing SwiftUI gestures](https://developer.apple.com/documentation/swiftui/composing-swiftui-gestures) covers gesture relationships.
- [Canvas](https://developer.apple.com/documentation/swiftui/canvas) provides immediate-mode drawing.

## Related topics

- [Interaction design and feedback](../2026-07-19-ios-interaction-design-feedback/)
- [Accessibility, localization, and inclusive product design](../2026-07-19-ios-accessibility-localization-inclusive-product-design/)
