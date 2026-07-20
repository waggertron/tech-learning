---
title: UIKit scrolling, drawing, layers, animation, and haptics
description: "Choose view animation, Core Animation, custom drawing, transitions, and haptics from measured interaction and rendering needs."
date: 2026-07-19
tags: [ios, swift, uikit, animation, performance]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-scrolling-drawing-layers-animation-haptics/
series:
  slug: zero-to-ios-hero
  order: 55
---

UIKit rendering work belongs at different layers. Views own hierarchy and interaction. Layers own compositing properties. Custom drawing produces pixels. Haptics reinforce an action but never carry its only meaning.

## Animate one source of truth

```swift
UIView.animate(withDuration: 0.25) {
    favoriteButton.configuration = self.favoriteConfiguration(isFavorite: true)
    self.view.layoutIfNeeded()
}
```

Update model state once, then animate the corresponding presentation. Do not animate a layer property and its owning constraint toward conflicting destinations.

## Keep scrolling work bounded

Reuse cells, cancel obsolete image tasks, resize images near their display size, and move decoding away from the main actor. Measure hitching before adding caches. A cache has a key, size bound, eviction policy, privacy policy, and memory-warning response.

## Draw the smallest region

Custom `draw(_:)` fits a badge or annotation whose pixels are cheaper than a hierarchy. Avoid invalidating the whole screen for a small change. Drawing does not add accessibility elements or interaction automatically.

## Use transitions for ownership changes

Navigation and custom transitions coordinate source, destination, duration, interruption, and cancellation. An interactive transition must finish or restore a coherent state.

Haptics follow successful actions such as favorite or save. Respect user settings, device capability, and repetition. Visual and spoken feedback remain complete without vibration.

## Validation boundary

Animation, scrolling performance, drawing, transition interruption, memory, energy, and physical-device haptics remain Not verified.

## Series navigation

- Previous: [Part 54: UIKit collection views and compositional layout](../2026-07-19-uikit-collection-views-compositional-layout-cells-configuration/)
- Next: [Part 56: UIKit observation, concurrency, networking, and persistence](../2026-07-19-uikit-observation-concurrency-networking-persistence/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Animation and haptics](https://developer.apple.com/documentation/uikit/animation-and-haptics) covers UIKit feedback APIs.
- [Core Animation](https://developer.apple.com/documentation/quartzcore) provides layer-based animation.
- [UIScrollView](https://developer.apple.com/documentation/uikit/uiscrollview) defines scrolling behavior.

## Related topics

- [SwiftUI animation, gestures, drag and drop, and drawing](../2026-07-19-swiftui-animation-transitions-gestures-drag-drop-drawing/)
- [Visual systems, HIG, typography, color, symbols, and materials](../2026-07-19-ios-visual-systems-hig-typography-color-symbols-materials/)
