---
title: UIKit view-controller lifecycle and containment
description: "Compose loading, empty, list, and error regions with explicit controller ownership and the complete child-containment sequence."
date: 2026-07-19
tags: [ios, swift, uikit, view-controllers, containment]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-view-controller-lifecycle-containment-composition/
series:
  slug: zero-to-ios-hero
  order: 48
---

A view controller coordinates one screen or contained region. Lifecycle callbacks describe when its view loads, appears, lays out, and leaves. They are not interchangeable hooks.

## Match work to callback frequency

Build the hierarchy in `viewDidLoad`. Refresh appearance-specific state in appearance callbacks only when repetition is intended. Respond to geometry changes in layout callbacks without starting business work there.

## Contain complete states

```swift
private func show(_ child: UIViewController) {
    current?.willMove(toParent: nil)
    current?.view.removeFromSuperview()
    current?.removeFromParent()

    addChild(child)
    view.addSubview(child.view)
    child.view.frame = view.bounds
    child.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    child.didMove(toParent: self)
    current = child
}
```

The parent owns transitions among loading, empty, list, and error controllers. Each child owns one coherent region. The complete add and remove sequence preserves UIKit lifecycle and responder relationships.

Containment is useful when regions have independent behavior or reuse. A controller per label only adds ceremony. A single massive controller that owns storage, networking, formatting, navigation, and every child state hides boundaries.

## Preserve task lifetime

Store tasks that belong to a controller and cancel obsolete work when the controller or represented input ends. Use weak captures where a long-lived callback should not own the controller. Keep UI updates on the main actor.

## Validation boundary

The containment code was not compiled or exercised. Lifecycle order, appearance forwarding, rotation, memory behavior, task cancellation, and accessibility remain Not verified.

## Series navigation

- Previous: [Part 47: UIKit Auto Layout, stack views, guides, and priorities](../2026-07-19-uikit-auto-layout-stacks-guides-priorities-debugging/)
- Next: [Part 49: UIKit navigation, tabs, split views, and coordinators](../2026-07-19-uikit-navigation-tabs-split-views-coordinators/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [View controllers](https://developer.apple.com/documentation/uikit/view-controllers) covers custom container controllers and child ownership.
- [UIViewController](https://developer.apple.com/documentation/uikit/uiviewcontroller) defines controller lifecycle.

## Related topics

- [UIKit's event-driven mental model and app lifecycle](../2026-07-19-uikit-event-driven-mental-model-app-lifecycle/)
- [SwiftUI Observation, environment, and dependency flow](../2026-07-19-swiftui-observation-environment-dependency-flow/)
