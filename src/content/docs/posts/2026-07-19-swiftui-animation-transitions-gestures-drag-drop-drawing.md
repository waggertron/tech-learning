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

SwiftUI animates changes between two interface descriptions. Motion is an explanation of changed state, not a second source of truth.

## Animate the state change

```swift
Button {
    withAnimation(.snappy) {
        note.isFavorite.toggle()
    }
} label: {
    Label("Favorite", systemImage: note.isFavorite ? "star.fill" : "star")
}
```

The favorite value changes once. Animation controls how the visual difference appears. Persistence and error recovery still need a model contract.

## Transitions need insertion or removal

```swift
if showsSavedMessage {
    Text("Saved")
        .transition(.opacity.combined(with: .move(edge: .top)))
}
```

A transition describes a view entering or leaving the hierarchy. It does not animate a property that remains in place. The surrounding state change needs an animation transaction.

## Respect reduced motion

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion

private var savedTransition: AnyTransition {
    reduceMotion ? .opacity : .move(edge: .top).combined(with: .opacity)
}
```

Meaning survives when large movement is removed. Save status also has text and accessibility semantics.

## Define gesture precedence

A row containing a button, navigation action, swipe action, and long press can produce conflicts. Prefer native controls and container APIs. When custom gestures are necessary, state which gesture wins, whether simultaneous recognition is allowed, and what keyboard or accessibility action provides the same result.

```swift
TagChip(name: tag.name)
    .draggable(tag.id.rawValue)
```

Drop handling validates the transferred type and domain ID before mutating order. Drag and drop is an alternate path, not the only way to reorder tags.

## Draw values, not hidden controls

```swift
struct MapBadge: View {
    let count: Int

    var body: some View {
        Canvas { context, size in
            let rect = CGRect(origin: .zero, size: size).insetBy(dx: 2, dy: 2)
            context.fill(Path(ellipseIn: rect), with: .color(.accentColor))
        }
        .overlay { Text(count, format: .number).foregroundStyle(.white) }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(count) notes at this location")
    }
}
```

Custom drawing can reduce view count and express shapes. It does not automatically provide controls, hit testing, Dynamic Type, or accessibility semantics.

## Validate interaction as a matrix

Check touch, pointer, keyboard, VoiceOver, Voice Control, Reduce Motion, interruption mid-animation, and drag cancellation. Profile drawing and animation on hardware before making performance claims.

## Validation boundary

The snippets were not compiled or rendered. Animation timing, gesture precedence, transfer behavior, reduced motion, accessibility, drawing performance, and device haptics remain Not verified.

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
