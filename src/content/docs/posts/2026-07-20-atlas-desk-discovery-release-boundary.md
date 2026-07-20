---
title: "Atlas Desk discovery and release boundary"
description: "How should a research organizer support quick capture, deep editing, and reliable retrieval?"
date: 2026-07-20
tags: [ios, swift, case-study, atlas]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-atlas-desk-discovery-release-boundary/
series:
  slug: zero-to-ios-hero
  order: 111
---

Atlas Desk is a local-first research organizer for quick capture, connected documents, attachments, search, and deliberate export across iPhone, iPad, and Mac. Its design favors durable ownership and retrieval over feature count.

## Product decision

How should a research organizer support quick capture, deep editing, and reliable retrieval?

The smallest useful vertical slice is concrete: Define the document, attachment, tag, backlink, and saved-search vocabulary around one release loop: capture, connect, find, and export.

## Boundaries that keep the design honest

- Keep document identity and revision rules in framework-neutral types that can be tested without an application target.
- Treat phone, tablet, and Mac interfaces as adapters to the same tasks while respecting each platform's navigation and input conventions.
- Make local persistence authoritative; search, files, cloud sharing, and interface projections derive from committed document state.
- Record migration, conflict, accessibility, large-library, and interruption evidence before calling the release ready.
- Avoid this failure: Copying the entire feature set of an established desktop knowledge tool before proving a focused workflow.

## Release evidence

The product model was reviewed, but no Atlas Desk app target, SwiftUI scene, SwiftData store, CloudKit container, macOS window, migration, or device journey was built or executed.

This chapter is an architecture and review artifact. Apple SDK behavior still needs the matching Xcode target, Simulator where representative, configured account or entitlement where required, and physical-device evidence for hardware or field behavior. The browser Swift runner proves none of those Apple platform surfaces.

## Series navigation

- Previous: [Part 110: Home, Matter, CarPlay, files, collaboration, and specialized extensions](../2026-07-20-home-matter-carplay-files-collaboration-specialized-extensions/)
- Next: [Part 112: Atlas Desk domain and architecture](../2026-07-20-atlas-desk-domain-architecture/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SwiftUI](https://developer.apple.com/documentation/swiftui)
- [Building a document-based app using SwiftData](https://developer.apple.com/documentation/swiftui/building-a-document-based-app-using-swiftdata)
- [CloudKit](https://developer.apple.com/documentation/cloudkit)

## Related topics

- [Data architecture, source of truth, cache, offline, sync, and conflict](../2026-07-19-ios-data-architecture-source-truth-cache-offline-sync-conflict/)
- [SwiftUI scenes, windows, navigation, commands, and platform adaptation](../2026-07-19-swiftui-scenes-windows-navigation-commands-platform/)

