---
title: UIKit traits, accessibility, localization, and restoration
description: "Adapt UIKit to changing traits, appearance, assistive technology, locale, and scene restoration without freezing launch-time assumptions."
date: 2026-07-19
tags: [ios, swift, uikit, accessibility, restoration]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-traits-appearance-accessibility-localization-restoration/
series:
  slug: zero-to-ios-hero
  order: 57
---

UIKit interfaces live in a changing environment. Window size, content-size category, appearance, contrast, layout direction, input method, and accessibility settings can change while a controller remains alive.

## Respond to current traits

```swift
override func traitCollectionDidChange(_ previous: UITraitCollection?) {
    super.traitCollectionDidChange(previous)
    guard traitCollection.hasDifferentColorAppearance(comparedTo: previous) else { return }
    refreshCustomDrawingColors()
}
```

System colors and preferred fonts adapt automatically when configured correctly. Custom drawing and cached assets may need invalidation. Do not branch on one launch-time screen width.

## Audit semantics, not labels alone

Native controls begin with useful roles. Custom controls need label, value, traits, actions, focus order, activation behavior, and input alternatives. Test VoiceOver, Voice Control, keyboard access, Switch Control, large text, contrast, reduced motion, and right-to-left layout.

User-authored note text is data, not a localization key. Format dates, lists, numbers, and measurements from stored values using the current locale.

## Restore intent by stable identity

Scene restoration records selected note IDs, route intent, and safe draft state. On restore, resolve IDs against current data. A deleted note becomes a recoverable missing destination, not a crash.

Restoration is separate from durable persistence. The system may decline to restore a scene. The note library must remain correct either way.

## Validation boundary

Trait changes, custom appearance, VoiceOver, Dynamic Type, localization, right-to-left layout, and scene restoration remain Not verified.

## Series navigation

- Previous: [Part 56: UIKit observation, concurrency, networking, and persistence](../2026-07-19-uikit-observation-concurrency-networking-persistence/)
- Next: [Part 58: UIKit Field Notes capstone](../2026-07-19-uikit-field-notes-capstone/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [UITraitCollection](https://developer.apple.com/documentation/uikit/uitraitcollection) describes environment traits.
- [Accessibility for UIKit](https://developer.apple.com/documentation/uikit/accessibility-for-uikit) covers interface semantics.
- [Preserving your app's UI across launches](https://developer.apple.com/documentation/uikit/preserving-your-app-s-ui-across-launches) covers restoration.

## Related topics

- [Accessibility, localization, and inclusive product design](../2026-07-19-ios-accessibility-localization-inclusive-product-design/)
- [Adaptive design for iPhone, iPad, and windows](../2026-07-19-ios-adaptive-design-iphone-ipad-windows/)
