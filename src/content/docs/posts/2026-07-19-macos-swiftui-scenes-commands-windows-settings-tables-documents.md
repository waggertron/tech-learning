---
title: macOS with SwiftUI
description: "Build a native-feeling Mac workspace with document windows, menu commands, settings, tables, toolbars, keyboard access, and shared Field Notes behavior."
date: 2026-07-19
tags: [macos, swiftui, windows, commands, documents]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-macos-swiftui-scenes-commands-windows-settings-tables-documents/
series:
  slug: zero-to-ios-hero
  order: 89
---

A Mac app is more than an enlarged touch interface. Windows, menus, commands, settings, tables, files, toolbars, keyboard focus, and precise selection are primary product surfaces.

## Design the boundary

- DocumentGroup can own durable documents while each window owns selection, inspectors, navigation, and interaction state.
- Expose create, search, favorite, export, and navigation through standard menus and keyboard shortcuts.
- Tables support sortable columns and multiple selection. Settings hold app-wide preferences, not document data.
- Use a focused AppKit adapter when a mature native control is missing. Keep AppKit types outside the shared domain.

## Validation boundary

The scene design requires a macOS target and current SDK. It was not compiled or exercised here.

## Series navigation

- Previous: [Part 88: iPadOS, multitasking, pointer, keyboard, Pencil, and documents](../2026-07-19-ipados-multitasking-pointer-keyboard-pencil-documents/)
- Next: [Part 90: AppKit, Mac Catalyst, and framework choice](../2026-07-19-appkit-mac-catalyst-framework-choice/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SwiftUI scenes](https://developer.apple.com/documentation/swiftui/scenes)
- [Commands](https://developer.apple.com/documentation/swiftui/commands)
- [Designing for macOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-macos)

## Related topics

- [SwiftUI scenes and windows](../2026-07-19-swiftui-scenes-windows-navigation-commands-platform/)
- [One product across platforms](../2026-07-19-one-product-across-apple-platforms/)
