---
title: AppKit, Mac Catalyst, and framework choice
description: "Choose SwiftUI, AppKit, Catalyst, or a focused mixture by interaction quality, control depth, team knowledge, and measured reuse."
date: 2026-07-19
tags: [macos, swift, appkit, mac-catalyst, swiftui]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-appkit-mac-catalyst-framework-choice/
series:
  slug: zero-to-ios-hero
  order: 90
---

Framework choice is a product and maintenance decision. Promised code reuse matters only when the resulting Mac interaction, accessibility, performance, and ownership remain sound.

## Design the capability

- SwiftUI fits shared declarative interfaces and modern scene composition.
- AppKit fits deep Mac controls, text systems, window behavior, and mature imperative integrations.
- Mac Catalyst can carry an iPad app to Mac while adding menus, windows, pointer behavior, and platform adaptation.
- Mix at narrow adapter seams. Keep domain and application code independent of all three UI choices.

## Validation boundary

No AppKit or Catalyst target was built, profiled, or accessibility tested.

## Series navigation

- Previous: [Part 89: macOS with SwiftUI](../2026-07-19-macos-swiftui-scenes-commands-windows-settings-tables-documents/)
- Next: [Part 91: watchOS app structure and Watch connectivity](../2026-07-19-watchos-app-structure-watch-connectivity/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [AppKit](https://developer.apple.com/documentation/appkit)
- [Mac Catalyst](https://developer.apple.com/documentation/uikit/mac-catalyst)
- [SwiftUI](https://developer.apple.com/documentation/swiftui)

## Related topics

- [macOS with SwiftUI](../2026-07-19-macos-swiftui-scenes-commands-windows-settings-tables-documents/)
- [One product across platforms](../2026-07-19-one-product-across-apple-platforms/)
