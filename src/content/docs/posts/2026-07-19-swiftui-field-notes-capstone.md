---
title: SwiftUI Field Notes capstone
description: "Assemble a local-first Field Notes app from explicit product states, domain contracts, SwiftUI adapters, deterministic tests, and release evidence."
date: 2026-07-19
tags: [ios, swift, swiftui, capstone, architecture]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-field-notes-capstone/
series:
  slug: zero-to-ios-hero
  order: 44
---

The capstone is complete when the local product loop is coherent, recoverable, accessible, and tested. Sync and extra platform features do not rescue a broken local notebook.

## The release loop

```text
launch -> browse or empty state -> create or open note
   -> edit draft -> validate -> save locally -> retrieve later
```

Field Notes includes list, detail, editor, search, favorites, tags, optional place context, attachments, settings, and restoration. Every feature uses the same stable note identity and application contracts.

## Keep the dependency direction visible

```text
SwiftUI scenes and views
          |
          v
observable presentation models
          |
          v
FieldNotesCore use cases and values
          ^
          |
SwiftData, files, location, and network adapters
```

The composition root selects live or in-memory adapters. Views describe current state and emit actions. Durable rules remain testable without rendering SwiftUI.

## Assemble one state vocabulary

The app distinguishes initial loading, empty library, populated content, search with no matches, save progress, recoverable failure, offline stale content, permission denial, missing route, and restoration failure.

Draft edits remain separate from persisted notes. Save validates once, preserves text on failure, and prevents duplicate submission. Deletion has a precise confirmation and Undo policy.

## Acceptance checklist

- Create, edit, favorite, search, delete, undo, and relaunch preserve the documented contract.
- Stable IDs drive lists, selection, navigation, windows, tasks, and persistence.
- Cancellation prevents stale network or attachment results from replacing newer state.
- Empty, loading, error, offline, permission, and missing-note states offer useful recovery.
- VoiceOver, Dynamic Type, contrast, Reduce Motion, keyboard, localization, and right-to-left layout are audited.
- Domain and use-case tests run with deterministic clocks, IDs, stores, and service fakes.
- UI tests cover the smallest critical create and recovery journeys.
- Migration, launch, scrolling, memory, and device-sensitive behavior carry separate evidence.

## Stop before speculative scope

Cloud sync, collaboration, widgets, live activities, and watch support wait until a measured product need justifies them. The local architecture leaves seams for those adapters without pretending they already work.

## Evidence ledger

Record each claim as compiled, package tested, Simulator tested, device tested, account tested, or Not verified. Browser Swift cannot prove this capstone because it cannot import Apple frameworks.

## Current repository checkpoint

The repository contains a tested `FieldNotesCore` package plus reproducible SwiftUI and UIKit target declarations. The SwiftUI app source shows the composition shape. Full Xcode, Simulator, signing, assistive technology, migration, and device gates remain open.

## Validation boundary

This post assembles the release contract but does not claim a shipped app. The capstone remains Not verified as an Apple application until the companion target builds and the recorded UI, accessibility, Simulator, and device checks pass.

## Series navigation

- Previous: [Part 43: SwiftUI previews, tests, accessibility, and performance](../2026-07-19-swiftui-previews-testing-ui-accessibility-performance/)
- Next: [Part 45: UIKit's event-driven mental model and app lifecycle](../2026-07-19-uikit-event-driven-mental-model-app-lifecycle/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SwiftUI](https://developer.apple.com/documentation/swiftui/) is the interface framework boundary.
- [SwiftData](https://developer.apple.com/documentation/swiftdata) is the declarative persistence adapter used in this arc.
- [Accessibility](https://developer.apple.com/accessibility/) collects platform design and testing guidance.

## Related topics

- [From app idea to user problem](../2026-07-19-ios-app-idea-user-problem/)
- [Modules, packages, access control, interoperability, and API design](../2026-07-19-swift-modules-packages-access-control-interoperability-api-design/)
