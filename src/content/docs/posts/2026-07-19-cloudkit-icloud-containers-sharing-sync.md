---
title: CloudKit, iCloud containers, sharing, and sync
description: "Evaluate CloudKit through account, container, zone, conflict, sharing, local-first, schema, and operational requirements."
date: 2026-07-19
tags: [ios, swift, cloudkit, icloud, sync, sharing]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-cloudkit-icloud-containers-sharing-sync/
series:
  slug: zero-to-ios-hero
  order: 99
---

CloudKit can provide Apple-account-backed storage and sharing, but it does not remove synchronization design. Local truth, pending operations, stable identity, retry, conflict, and account transitions still need explicit owners.

## Design the capability

- Keep CloudKit records and zones in an adapter. Domain notes do not import CloudKit types.
- Map signed out, unavailable, restricted, quota, network, partial, and server-change states into recoverable product behavior.
- Use record versions and deterministic conflict policy. Preserve both user edits when automatic merge is unsafe.
- Sharing needs participant roles, revocation, invitation handling, and local visibility updates.

## Validation boundary

No iCloud container, entitlement, schema deployment, Apple account, share invitation, network sync, or device run occurred.

## Series navigation

- Previous: [Part 98: App Intents, Shortcuts, Spotlight, and system actions](../2026-07-19-app-intents-shortcuts-spotlight-system-actions/)
- Next: [Part 100: MapKit, Core Location, geocoding, and WeatherKit](../2026-07-19-mapkit-core-location-geocoding-weatherkit/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [CloudKit](https://developer.apple.com/documentation/cloudkit)
- [CloudKit Console](https://developer.apple.com/icloud/cloudkit/)
- [CKSyncEngine](https://developer.apple.com/documentation/cloudkit/cksyncengine)

## Related topics

- [Data architecture and offline sync](../2026-07-19-ios-data-architecture-source-truth-cache-offline-sync-conflict/)
- [Repositories and adapters](../2026-07-19-ios-repositories-gateways-clients-ports-adapters/)
