---
title: "PulseTrail cross-device architecture"
description: "Which device owns workout state, route guidance, sensor samples, and synchronization?"
date: 2026-07-20
tags: [ios, swift, case-study, pulse]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-pulsetrail-cross-device-architecture/
series:
  slug: zero-to-ios-hero
  order: 118
---

PulseTrail is an offline-aware outdoor fitness product split between iPhone and Apple Watch. It treats location and health data as sensitive observations, and it never turns a best-effort consumer device into an emergency guarantee.

## Product decision

Which device owns workout state, route guidance, sensor samples, and synchronization?

The smallest useful vertical slice is concrete: Make one workout session authoritative, then exchange versioned commands, summaries, acknowledgments, and recovery snapshots.

## Boundaries that keep the design honest

- Declare one authority for the active workout and make cross-device messages idempotent, versioned, and recoverable.
- Preserve units, timestamps, provenance, gaps, and authorization state with every health or route observation.
- Design useful offline and low-power behavior before adding live transfer or decorative metrics.
- Test interruption, denied access, stale location, sensor gaps, process loss, and delayed synchronization as normal states.
- Avoid this failure: Allowing phone and watch to be simultaneous writable authorities for every workout field.

## Release evidence

No PulseTrail target, HealthKit store, WorkoutKit schedule, workout session, route recording, Watch connectivity session, background execution, or physical outdoor test was exercised.

This chapter is an architecture and review artifact. Apple SDK behavior still needs the matching Xcode target, Simulator where representative, configured account or entitlement where required, and physical-device evidence for hardware or field behavior. The browser Swift runner proves none of those Apple platform surfaces.

## Series navigation

- Previous: [Part 117: PulseTrail product, safety, and privacy](../2026-07-20-pulsetrail-product-safety-privacy/)
- Next: [Part 119: PulseTrail HealthKit, WorkoutKit, maps, and location](../2026-07-20-pulsetrail-healthkit-workoutkit-maps-location/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Workouts and activity rings](https://developer.apple.com/documentation/healthkit/workouts-and-activity-rings)
- [WorkoutKit](https://developer.apple.com/documentation/workoutkit)
- [MapKit](https://developer.apple.com/documentation/mapkit)

## Related topics

- [HealthKit, WorkoutKit, and health-data design](../2026-07-19-healthkit-workoutkit-health-data-design/)
- [MapKit, Core Location, geocoding, and WeatherKit](../2026-07-19-mapkit-core-location-geocoding-weatherkit/)

