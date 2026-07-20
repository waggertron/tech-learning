---
title: App Intents, Shortcuts, Spotlight, and system actions
description: "Expose stable entities and application commands to system surfaces without moving UI logic or ambiguous identity into intents."
date: 2026-07-19
tags: [ios, swift, app-intents, shortcuts, spotlight]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-app-intents-shortcuts-spotlight-system-actions/
series:
  slug: zero-to-ios-hero
  order: 98
---

App Intents turns application capabilities into typed system actions. The same create-note and search-note use cases can serve Shortcuts, Siri, Spotlight, widgets, and controls when identity and authorization are explicit.

## Design the capability

- Define entities with stable IDs, concise display representations, and deterministic queries.
- Intent parameters express required input and disambiguation. The perform method calls an application use case.
- Return a useful result, dialog, or route without importing view-only state into the intent.
- Index only content the user expects to search and remove stale or unauthorized Spotlight records.

## Validation boundary

No intent extension, Shortcut, Siri invocation, Spotlight index, entitlement, language model interaction, or device run occurred.

## Series navigation

- Previous: [Part 97: WidgetKit and Live Activities](../2026-07-19-widgetkit-live-activities/)
- Next: [Part 99: CloudKit, iCloud containers, sharing, and sync](../2026-07-19-cloudkit-icloud-containers-sharing-sync/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [App Intents](https://developer.apple.com/documentation/appintents)
- [Core Spotlight](https://developer.apple.com/documentation/corespotlight)
- [Shortcuts](https://developer.apple.com/documentation/shortcuts)

## Related topics

- [Background work and extensions](../2026-07-19-ios-background-work-notifications-deep-links-app-extensions/)
- [Domain models and use cases](../2026-07-19-ios-domain-models-value-objects-invariants-use-cases/)
