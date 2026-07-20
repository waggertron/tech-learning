---
title: Background work, notifications, deep links, and app extensions
description: "Model system-scheduled background work and extension entry points as bounded adapters around shared routes and application behavior."
date: 2026-07-19
tags: [ios, swift, background-tasks, notifications, app-extensions]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-background-work-notifications-deep-links-app-extensions/
series:
  slug: zero-to-ios-hero
  order: 82
---

iOS decides when suspended apps receive background time. A request is an opportunity, not a timer guarantee. Work must be bounded, cancellable, resumable, and safe to repeat.

## Design the boundary

- A BackgroundTasks adapter starts a sync use case, connects expiration to cancellation, reports completion, and submits future eligibility.
- Notification taps, universal links, widgets, intents, and share extensions parse input into the same validated route or command model.
- Extensions have separate targets, entitlements, memory limits, and available APIs. Keep them narrow.
- Local scheduling policy is testable. Remote delivery, token lifecycle, background timing, and extension execution need signed device evidence.

## Validation boundary

No background launch, remote delivery, extension, account, or device run occurred.

## Series navigation

- Previous: [Part 81: Security, privacy, permissions, and platform policy](../2026-07-19-ios-security-privacy-permissions-platform-policy/)
- Next: [Part 83: Logging, analytics, crashes, privacy, and feature flags](../2026-07-19-ios-logging-analytics-crashes-privacy-feature-flags/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [BackgroundTasks](https://developer.apple.com/documentation/backgroundtasks)
- [UserNotifications](https://developer.apple.com/documentation/usernotifications)
- [App extensions](https://developer.apple.com/app-extensions/)

## Related topics

- [Routes, deep links, and restoration](../2026-07-19-ios-coordinators-routers-deep-links-restoration/)
- [Concurrency architecture](../2026-07-19-ios-concurrency-architecture-isolation-cancellation-lifecycle/)
