---
title: WidgetKit and Live Activities
description: "Choose timeline and live surfaces for glanceable state, bounded updates, deep links, privacy, and clear unavailable behavior."
date: 2026-07-19
tags: [ios, watchos, widgetkit, activitykit, widgets]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-widgetkit-live-activities/
series:
  slug: zero-to-ios-hero
  order: 97
---

A widget is a scheduled glance into durable app state. A Live Activity shows bounded, currently relevant progress. Neither is an always-running miniature app.

## Design the capability

- A recent-note widget reads a compact shared snapshot and provides a route back into the app.
- Timeline entries describe when content is valid. Reload requests are hints subject to system budgets.
- A Live Activity starts for a user-visible event, updates only meaningful progress, and ends promptly.
- Keep lock-screen content privacy aware and make stale, missing, signed-out, and unsupported states useful.

## Validation boundary

No widget extension, timeline scheduling, App Group, push update, Live Activity, or device lock-screen evidence was produced.

## Series navigation

- Previous: [Part 96: RealityKit, ARKit, immersive spaces, comfort, and assets](../2026-07-19-realitykit-arkit-immersive-spaces-comfort-assets/)
- Next: [Part 98: App Intents, Shortcuts, Spotlight, and system actions](../2026-07-19-app-intents-shortcuts-spotlight-system-actions/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [WidgetKit](https://developer.apple.com/documentation/widgetkit)
- [ActivityKit](https://developer.apple.com/documentation/activitykit)
- [Widgets HIG](https://developer.apple.com/design/human-interface-guidelines/widgets)

## Related topics

- [Background work and extensions](../2026-07-19-ios-background-work-notifications-deep-links-app-extensions/)
- [Routes and restoration](../2026-07-19-ios-coordinators-routers-deep-links-restoration/)
