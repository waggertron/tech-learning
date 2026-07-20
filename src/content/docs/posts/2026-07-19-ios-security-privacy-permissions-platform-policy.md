---
title: Security, privacy, permissions, and platform policy
description: "Design around sandboxing, least privilege, just-in-time consent, privacy declarations, transport protection, and useful denial paths."
date: 2026-07-19
tags: [ios, swift, security, privacy, permissions, entitlements]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-security-privacy-permissions-platform-policy/
series:
  slug: zero-to-ios-hero
  order: 81
---

Security and privacy shape the product boundary. The sandbox limits access, entitlements grant signed capabilities, purpose strings explain protected-resource requests, and privacy declarations describe relevant data and API use.

## Design the boundary

- Request location only after the user chooses Add Location and explain the useful no-location path before the prompt.
- Model not determined, allowed, denied, restricted, unavailable, and revoked states when the framework exposes them.
- Keep sensitive values out of logs, analytics, URLs, preferences, and source control. Remove unused entitlements and background modes.
- Hidden controls are not authorization. Server and domain policy still enforce access.

## Validation boundary

Permission prompts, entitlement signing, privacy manifests, transport policy, and review behavior require Apple targets and current policy review.

## Series navigation

- Previous: [Part 80: Persistence, Core Data, files, caches, migrations, and secure storage](../2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage/)
- Next: [Part 82: Background work, notifications, deep links, and app extensions](../2026-07-19-ios-background-work-notifications-deep-links-app-extensions/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources)
- [Privacy manifests](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
- [Entitlements](https://developer.apple.com/documentation/bundleresources/entitlements)

## Related topics

- [Inclusive product design](../2026-07-19-ios-accessibility-localization-inclusive-product-design/)
- [Networking and authentication](../2026-07-19-ios-networking-authentication-realtime-resilience/)
