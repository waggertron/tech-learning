---
title: UIKit responder chain, gestures, menus, and input
description: "Trace touch, pointer, keyboard, menu, gesture, and drag events to one intentional handler with accessible alternatives."
date: 2026-07-19
tags: [ios, swift, uikit, responder-chain, gestures]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-responder-chain-gestures-menus-drag-drop-input/
series:
  slug: zero-to-ios-hero
  order: 51
---

UIKit routes events through controls, gesture recognizers, delegates, and the responder chain. Good interaction design makes ownership and precedence visible.

## Follow the responder path

An unhandled action moves from the first responder through its superview, view controller, window, and application. This enables focused commands without global controller lookups.

```swift
override var keyCommands: [UIKeyCommand]? {
    [UIKeyCommand(input: "n", modifierFlags: .command,
                  action: #selector(createNote), discoverabilityTitle: "New Note")]
}
```

The command calls the same create-note path as the visible button. Enabled state follows the current scene and selection.

## Define gesture relationships

```swift
let longPress = UILongPressGestureRecognizer(target: self, action: #selector(showMenu))
row.addGestureRecognizer(longPress)
```

Before adding recognizers, check whether buttons, context menus, swipe actions, and drag delegates already express the interaction. If recognizers compete, define failure requirements or simultaneous recognition intentionally.

## Menus expose discoverable actions

```swift
button.menu = UIMenu(children: [
    UIAction(title: "Favorite", image: UIImage(systemName: "star")) { [weak self] _ in
        self?.favoriteSelectedNote()
    }
])
button.showsMenuAsPrimaryAction = true
```

Context menus and swipe actions supplement visible controls. Essential actions still need keyboard and accessibility routes.

## Drag data, not view objects

Drag sessions transfer a typed representation or stable ID. Drop code validates the type and current domain object before mutation. Reordering also needs buttons or accessibility custom actions.

## Validation boundary

Event routing, recognizer precedence, menus, keyboard commands, pointer input, drag sessions, and assistive alternatives remain Not verified without UIKit runtime testing.

## Series navigation

- Previous: [Part 50: UIKit sheets, popovers, alerts, activities, and pickers](../2026-07-19-uikit-sheets-popovers-alerts-activities-system-pickers/)
- Next: [Part 52: UIKit text, forms, keyboards, focus, and validation](../2026-07-19-uikit-text-forms-keyboards-focus-validation/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Using responders and the responder chain to handle events](https://developer.apple.com/documentation/uikit/using-responders-and-the-responder-chain-to-handle-events) explains event routing.
- [UIGestureRecognizer](https://developer.apple.com/documentation/uikit/uigesturerecognizer) defines gesture recognition.
- [Menus and shortcuts](https://developer.apple.com/documentation/uikit/menus-and-shortcuts) covers commands and menus.

## Related topics

- [Interaction design and feedback](../2026-07-19-ios-interaction-design-feedback/)
- [SwiftUI animation, gestures, drag and drop, and drawing](../2026-07-19-swiftui-animation-transitions-gestures-drag-drop-drawing/)
