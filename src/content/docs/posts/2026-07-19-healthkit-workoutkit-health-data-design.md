---
title: HealthKit, WorkoutKit, and health-data design
description: "Treat health authorization, provenance, units, queries, workouts, minimization, export, and deletion as domain-level privacy constraints."
date: 2026-07-19
tags: [ios, watchos, healthkit, workoutkit, privacy]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-healthkit-workoutkit-health-data-design/
series:
  slug: zero-to-ios-hero
  order: 105
---

Health data changes the domain model. A quantity needs its type, unit, time interval, source, device, and provenance. A bare number is not enough.

## Design the capability

- Request read and write types separately and only for a visible feature. Authorization outcomes do not reveal more than the framework permits.
- Normalize units at the domain boundary while retaining original source metadata needed for interpretation.
- Use anchored or observer queries according to the product and tolerate delayed background delivery.
- Treat denial as normal, minimize retention, avoid casual export, and make deletion and account behavior explicit.

## Validation boundary

No HealthKit store, health data, workout session, background delivery, entitlement, review, or physical-device evidence was produced.

## Series navigation

- Previous: [Part 104: Core Bluetooth, nearby interaction, accessories, and connectivity](../2026-07-19-core-bluetooth-nearby-interaction-accessories-connectivity/)
- Next: [Part 106: Core ML, Vision, Natural Language, and on-device intelligence](../2026-07-19-core-ml-vision-natural-language-on-device-intelligence/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [HealthKit](https://developer.apple.com/documentation/healthkit)
- [WorkoutKit](https://developer.apple.com/documentation/workoutkit)
- [Health and fitness HIG](https://developer.apple.com/design/human-interface-guidelines/health-and-fitness)

## Related topics

- [Watch workouts](../2026-07-19-watchos-workouts-complications-smart-stack-constraints/)
- [Security and privacy](../2026-07-19-ios-security-privacy-permissions-platform-policy/)
