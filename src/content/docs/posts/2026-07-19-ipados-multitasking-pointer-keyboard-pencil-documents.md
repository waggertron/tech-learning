---
title: iPadOS, multitasking, pointer, keyboard, Pencil, and documents
description: "Turn Field Notes into an adaptive iPad workspace with independent windows, commands, drag and drop, document boundaries, and optional Pencil input."
date: 2026-07-19
tags: [ipados, swiftui, multitasking, keyboard, pencilkit, documents]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ipados-multitasking-pointer-keyboard-pencil-documents/
series:
  slug: zero-to-ios-hero
  order: 88
---

An iPad app becomes desktop-class by respecting resizing, independent scenes, keyboard and pointer input, drag and drop, documents, and dense work. Device idiom alone cannot describe that environment.

## Design the boundary

- Each window owns route, selection, search, and draft lifetime while repositories share durable notes.
- Compact width can use a stack. Regular width can use library, detail, and inspector columns. Live resizing preserves intent.
- Every primary action has a menu or keyboard command. Pointer affordances do not replace labels or focus.
- PencilKit fits annotation when handwriting serves the task. Store drawing data as a versioned attachment and retain typed editing.

## Validation boundary

No iPad Simulator, hardware keyboard, pointer, Pencil, document provider, or physical iPad evidence was available.

## Series navigation

- Previous: [Part 87: One product across Apple platforms](../2026-07-19-one-product-across-apple-platforms/)
- Next: [Part 89: macOS with SwiftUI](../2026-07-19-macos-swiftui-scenes-commands-windows-settings-tables-documents/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [PencilKit](https://developer.apple.com/documentation/pencilkit)
- [Document-based apps](https://developer.apple.com/documentation/swiftui/building-a-document-based-app-using-swiftdata)
- [Designing for iPadOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-ipados)

## Related topics

- [Adaptive design](../2026-07-19-ios-adaptive-design-iphone-ipad-windows/)
- [SwiftUI scenes and windows](../2026-07-19-swiftui-scenes-windows-navigation-commands-platform/)
