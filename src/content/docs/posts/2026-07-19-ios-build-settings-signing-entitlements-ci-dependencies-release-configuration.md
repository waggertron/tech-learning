---
title: Build settings, signing, entitlements, CI, dependencies, and release configuration
description: "Produce development, staging, and production artifacts from explicit configuration, signing, dependency, archive, and secret boundaries."
date: 2026-07-19
tags: [ios, swift, xcode, signing, ci, release]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-build-settings-signing-entitlements-ci-dependencies-release-configuration/
series:
  slug: zero-to-ios-hero
  order: 85
---

A release configuration is an auditable build input. It selects endpoints, identifiers, capabilities, optimization, diagnostics, and signing without embedding credentials in source control.

## Design the boundary

- The composition root reads validated nonsecret settings. Secrets enter through protected CI or developer storage at the narrow tool that needs them.
- Pin package versions and review resolved dependency changes. Keep capabilities and entitlements minimal per target.
- Archive the same scheme and configuration exercised by the release lane. Preserve logs, symbols, test results, and provenance.
- Signing proves executable identity and authorized entitlements. It does not prove product behavior.

## Validation boundary

No archive, signing identity, provisioning profile, App Store connection, or release CI lane was available.

## Series navigation

- Previous: [Part 84: Instruments, responsiveness, energy, launch, and networking](../2026-07-19-ios-instruments-responsiveness-energy-launch-networking/)
- Next: [Part 86: TestFlight, App Store review, launch, observability, and evolution](../2026-07-19-ios-testflight-app-store-review-launch-observability-evolution/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Build settings](https://developer.apple.com/documentation/xcode/build-settings-reference)
- [App capabilities](https://developer.apple.com/documentation/xcode/adding-capabilities-to-your-app)
- [Code signing](https://developer.apple.com/support/code-signing/)

## Related topics

- [Composition root](../2026-07-19-ios-dependency-injection-composition-root/)
- [CI and release evidence](../2026-07-19-ios-ci-flake-control-test-data-release-evidence/)
