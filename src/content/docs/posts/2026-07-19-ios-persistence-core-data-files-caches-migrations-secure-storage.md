---
title: Persistence, Core Data, files, caches, migrations, and secure storage
description: "Choose storage by durability, query, size, secrecy, migration, and recovery requirements."
date: 2026-07-19
tags: [ios, swift, persistence, swiftdata, core-data, keychain]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage/
series:
  slug: zero-to-ios-hero
  order: 80
---

Storage is a set of contracts, not one database choice. Field Notes keeps searchable note metadata in a model store, large attachments as files, disposable thumbnails in a cache, small preferences in defaults, and credentials in Keychain.

## Design the boundary

- SwiftData or Core Data fits durable queryable models. Files fit large bytes that need explicit lifecycle ownership.
- Cache eviction is normal. Durable data loss is an incident, so those errors need different recovery paths.
- Historical schema fixtures prove migration. A fresh latest schema proves only first launch.
- The Keychain adapter owns credential create, update, read, delete, and accessibility policy. Tests use a credential-free in-memory substitute.

## Validation boundary

No SwiftData, Core Data, file-protection, or Keychain operation ran without a full Apple SDK environment.

## Series navigation

- Previous: [Part 79: Networking, authentication, real-time events, and resilience](../2026-07-19-ios-networking-authentication-realtime-resilience/)
- Next: [Part 81: Security, privacy, permissions, and platform policy](../2026-07-19-ios-security-privacy-permissions-platform-policy/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [SwiftData](https://developer.apple.com/documentation/swiftdata)
- [Core Data](https://developer.apple.com/documentation/coredata)
- [Keychain Services](https://developer.apple.com/documentation/security/keychain-services)

## Related topics

- [Persistence and contract tests](../2026-07-19-ios-persistence-migration-network-contract-tests/)
- [Data architecture and offline sync](../2026-07-19-ios-data-architecture-source-truth-cache-offline-sync-conflict/)
