---
title: Core Bluetooth, nearby interaction, accessories, and connectivity
description: "Model discovery, connection, protocol framing, permissions, capability checks, timeouts, recovery, and device evidence for nearby hardware."
date: 2026-07-19
tags: [ios, swift, core-bluetooth, nearby-interaction, accessories]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-core-bluetooth-nearby-interaction-accessories-connectivity/
series:
  slug: zero-to-ios-hero
  order: 104
---

Nearby hardware is an unreliable distributed system with radio state, discovery, pairing, transport framing, firmware variation, permission, and physical proximity.

## Design the capability

- Model unavailable, unauthorized, powered off, scanning, discovered, connecting, ready, reconnecting, failed, and disconnected states.
- Bound scan duration and filter by service. Stop work when the feature or app lifetime ends.
- Bluetooth characteristic updates are transport chunks, not guaranteed application messages. Define framing, versioning, checksums, and retry.
- Keep Core Bluetooth, Nearby Interaction, and accessory APIs behind capability adapters with deterministic protocol fixtures.

## Validation boundary

No Bluetooth radio, nearby token exchange, accessory program, entitlement, firmware, packet trace, or physical-device recovery test occurred.

## Series navigation

- Previous: [Part 103: Video capture, editing, playback, and streaming architecture](../2026-07-19-video-capture-editing-playback-streaming-architecture/)
- Next: [Part 105: HealthKit, WorkoutKit, and health-data design](../2026-07-19-healthkit-workoutkit-health-data-design/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Core Bluetooth](https://developer.apple.com/documentation/corebluetooth)
- [Nearby Interaction](https://developer.apple.com/documentation/nearbyinteraction)
- [External Accessory](https://developer.apple.com/documentation/externalaccessory)

## Related topics

- [Reducers and state machines](../2026-07-19-ios-unidirectional-data-flow-reducers-state-machines/)
- [Concurrency architecture](../2026-07-19-ios-concurrency-architecture-isolation-cancellation-lifecycle/)
