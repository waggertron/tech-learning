---
title: Workouts, complications, Smart Stack, and watch constraints
description: "Design workout sessions and glanceable timelines around wrist interaction, system scheduling, battery, privacy, and bounded background delivery."
date: 2026-07-19
tags: [watchos, healthkit, widgetkit, workouts, complications]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-watchos-workouts-complications-smart-stack-constraints/
series:
  slug: zero-to-ios-hero
  order: 92
---

Workout and glanceable surfaces are system partnerships. The app declares useful state and eligible work, but the operating system controls presentation, scheduling, and much of the lifecycle.

## Design the capability

- A workout session models active, paused, ended, failed, and recovered states and persists important transitions.
- Complications and Smart Stack widgets publish concise timeline entries from shared durable state.
- Avoid polling. Use supported sessions and delivery mechanisms, then tolerate delayed or missing opportunities.
- Health authorization is granular and revocable. Denial remains a normal product state.

## Validation boundary

No HealthKit authorization, workout session, background delivery, complication, Smart Stack, or watch hardware evidence was produced.

## Series navigation

- Previous: [Part 91: watchOS app structure and Watch connectivity](../2026-07-19-watchos-app-structure-watch-connectivity/)
- Next: [Part 93: tvOS focus, remote input, shelves, and navigation](../2026-07-19-tvos-focus-remote-input-shelves-navigation/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [HealthKit workouts](https://developer.apple.com/documentation/healthkit/workouts_and_activity_rings)
- [WidgetKit](https://developer.apple.com/documentation/widgetkit)
- [WorkoutKit](https://developer.apple.com/documentation/workoutkit)

## Related topics

- [watchOS structure](../2026-07-19-watchos-app-structure-watch-connectivity/)
- [Security and permissions](../2026-07-19-ios-security-privacy-permissions-platform-policy/)
