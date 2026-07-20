---
title: "Atlas Desk domain and architecture"
description: "How can documents, backlinks, tags, attachments, and search remain independent of storage and interface frameworks?"
date: 2026-07-20
tags: [ios, swift, case-study, atlas]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-atlas-desk-domain-architecture/
series:
  slug: zero-to-ios-hero
  order: 112
---

Atlas Desk is a local-first research organizer for quick capture, connected documents, attachments, search, and deliberate export across iPhone, iPad, and Mac. Its design favors durable ownership and retrieval over feature count.

## Product decision

How can documents, backlinks, tags, attachments, and search remain independent of storage and interface frameworks?

The smallest useful vertical slice is concrete: Use value types and application operations backed by repository, index, attachment, clock, and identifier contracts.

## Boundaries that keep the design honest

- Keep document identity and revision rules in framework-neutral types that can be tested without an application target.
- Treat phone, tablet, and Mac interfaces as adapters to the same tasks while respecting each platform's navigation and input conventions.
- Make local persistence authoritative; search, files, cloud sharing, and interface projections derive from committed document state.
- Record migration, conflict, accessibility, large-library, and interruption evidence before calling the release ready.
- Avoid this failure: Treating SwiftData relationships as the product specification instead of one persistence representation.

## Release evidence

The product model was reviewed, but no Atlas Desk app target, SwiftUI scene, SwiftData store, CloudKit container, macOS window, migration, or device journey was built or executed.

This chapter is an architecture and review artifact. Apple SDK behavior still needs the matching Xcode target, Simulator where representative, configured account or entitlement where required, and physical-device evidence for hardware or field behavior. The browser Swift runner proves none of those Apple platform surfaces.

## Series navigation

- Previous: [Part 111: Atlas Desk discovery and release boundary](../2026-07-20-atlas-desk-discovery-release-boundary/)
- Next: [Part 113: Atlas Desk SwiftUI phone and tablet app](../2026-07-20-atlas-desk-swiftui-phone-tablet-app/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SwiftUI](https://developer.apple.com/documentation/swiftui)
- [Building a document-based app using SwiftData](https://developer.apple.com/documentation/swiftui/building-a-document-based-app-using-swiftdata)
- [CloudKit](https://developer.apple.com/documentation/cloudkit)

## Related topics

- [Data architecture, source of truth, cache, offline, sync, and conflict](../2026-07-19-ios-data-architecture-source-truth-cache-offline-sync-conflict/)
- [SwiftUI scenes, windows, navigation, commands, and platform adaptation](../2026-07-19-swiftui-scenes-windows-navigation-commands-platform/)

