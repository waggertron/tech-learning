---
title: Core ML, Vision, Natural Language, and on-device intelligence
description: "Ship versioned on-device inference behind a tested adapter with measured accuracy, latency, size, energy, confidence, bias, and fallback."
date: 2026-07-19
tags: [ios, swift, core-ml, vision, natural-language, machine-learning]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-core-ml-vision-natural-language-on-device-intelligence/
series:
  slug: zero-to-ios-hero
  order: 106
---

On-device inference can reduce network dependence and data exposure, but local execution is not automatically accurate, small, fair, fast, or energy efficient.

## Design the capability

- Place a versioned model behind a purposeful protocol so product rules do not depend on generated model types.
- Specify input preprocessing, output labels, confidence calibration, unsupported input, cancellation, and fallback.
- Measure accuracy by meaningful segments plus latency, memory, package size, and energy on supported devices.
- Keep a human correction path and record model version with derived results. Never present confidence as certainty.

## Validation boundary

No model asset, Core ML compilation, Vision pipeline, Natural Language request, accuracy dataset, or physical-device benchmark was run.

## Series navigation

- Previous: [Part 105: HealthKit, WorkoutKit, and health-data design](../2026-07-19-healthkit-workoutkit-health-data-design/)
- Next: [Part 107: StoreKit, subscriptions, offers, and entitlement state](../2026-07-19-storekit-subscriptions-offers-entitlement-state/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Core ML](https://developer.apple.com/documentation/coreml)
- [Vision](https://developer.apple.com/documentation/vision)
- [Natural Language](https://developer.apple.com/documentation/naturallanguage)

## Related topics

- [Camera and Vision](../2026-07-19-camera-photokit-image-pipelines-vision/)
- [Repositories and adapters](../2026-07-19-ios-repositories-gateways-clients-ports-adapters/)
