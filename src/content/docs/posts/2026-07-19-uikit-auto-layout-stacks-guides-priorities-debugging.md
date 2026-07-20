---
title: UIKit Auto Layout, stack views, guides, and priorities
description: "Express an adaptive note editor with anchors, safe-area guides, stack views, Dynamic Type, priorities, and constraint debugging."
date: 2026-07-19
tags: [ios, swift, uikit, auto-layout, accessibility]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-auto-layout-stacks-guides-priorities-debugging/
series:
  slug: zero-to-ios-hero
  order: 47
---

Auto Layout describes relationships among views. It solves those relationships for the current container, safe areas, content sizes, and priorities.

## Build a complete constraint graph

```swift
let stack = UIStackView(arrangedSubviews: [titleField, bodyView, saveButton])
stack.axis = .vertical
stack.spacing = 12
stack.translatesAutoresizingMaskIntoConstraints = false
view.addSubview(stack)

let guide = view.safeAreaLayoutGuide
NSLayoutConstraint.activate([
    stack.leadingAnchor.constraint(equalTo: guide.leadingAnchor, constant: 16),
    stack.trailingAnchor.constraint(equalTo: guide.trailingAnchor, constant: -16),
    stack.topAnchor.constraint(equalTo: guide.topAnchor, constant: 16),
    stack.bottomAnchor.constraint(lessThanOrEqualTo: guide.bottomAnchor, constant: -16)
])
```

The safe area protects interactive content. A less-than bottom constraint allows short content without forcing an unnecessary stretch.

## Let text define size

Preferred fonts and `adjustsFontForContentSizeCategory` let labels respond to Dynamic Type. Avoid fixed label heights. Multiline labels need `numberOfLines = 0` and constraints that allow vertical growth.

Content hugging expresses resistance to growing beyond intrinsic size. Compression resistance expresses resistance to shrinking below it. Change priorities to encode a real product preference, not to silence a warning at random.

## Use layout guides for regions

Safe-area, readable-content, keyboard, and custom layout guides express meaningful regions without invisible spacer views. Stack views manage common linear relationships but do not replace constraints around the stack.

## Debug the broken relationship

When constraints conflict, read the logged equations, add identifiers to important constraints, inspect the view hierarchy, and find the incompatible product rules. Do not lower arbitrary priorities until the console stops.

Test narrow width, split view, rotation, long localization, right-to-left layout, and the largest text sizes. One simulator screenshot is one solved case.

## Validation boundary

The constraints were not compiled or rendered. Ambiguity, conflicts, keyboard layout guide behavior, Dynamic Type, localization, and size-class adaptation remain Not verified.

## Series navigation

- Previous: [Part 46: UIKit views, controls, target-action, and delegation](../2026-07-19-uikit-views-controls-configuration-target-action-delegation/)
- Next: [Part 48: UIKit view-controller lifecycle and containment](../2026-07-19-uikit-view-controller-lifecycle-containment-composition/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Auto Layout](https://developer.apple.com/documentation/uikit/auto-layout) covers constraint-based layout.
- [UIStackView](https://developer.apple.com/documentation/uikit/uistackview) manages arranged views along an axis.
- [Positioning content relative to the safe area](https://developer.apple.com/documentation/uikit/positioning-content-relative-to-the-safe-area) covers safe-area guides.

## Related topics

- [SwiftUI layout, safe areas, stacks, grids, and custom layout](../2026-07-19-swiftui-layout-safe-areas-stacks-grids-custom-layout/)
- [Visual systems, HIG, typography, color, symbols, and materials](../2026-07-19-ios-visual-systems-hig-typography-color-symbols-materials/)
