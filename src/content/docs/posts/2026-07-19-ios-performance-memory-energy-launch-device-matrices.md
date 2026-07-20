---
title: Performance, memory, energy, launch, and device matrices
description: "Set user-centered budgets, measure with XCTest and Instruments, and keep Simulator, device, thermal, and release evidence distinct."
date: 2026-07-19
tags: [ios, swift, testing, performance, instruments, energy, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-performance-memory-energy-launch-device-matrices/
series:
  slug: zero-to-ios-hero
  order: 77
---

Performance work begins with a user-visible budget and a reproducible workload. "Feels fast" and one simulator number are observations, not durable evidence.

## Define budgets around journeys

| Journey | Measure | Evidence shape |
| --- | --- | --- |
| cold launch to usable library | wall time and launch metric | release build on supported devices |
| scroll 2,000 notes | hitches, frame pacing, allocations | fixed fixture plus Instruments trace |
| open attachment editor | peak and retained memory | repeated enter and exit cycle |
| sync 500 changes | duration, bytes, CPU, energy | controlled network profile and signposts |

Record device model, OS, app build, data fixture, network profile, thermal state, power state, run count, and variance. Compare like with like.

## Use layers of evidence

XCTest performance measures repeatable code or journey metrics and produces result artifacts. Instruments explains CPU, allocation, leaks, hangs, signposts, disk, and network behavior. MetricKit can surface aggregated production diagnostics. Physical devices reveal thermal, energy, radio, storage, and hardware behavior that Simulator cannot prove.

## Measure release behavior

Optimization level, diagnostics, logging, database contents, image sizes, and network conditions change results. Keep a small deterministic fixture for regression and a realistic large fixture for capacity. Warm and cold launch answer different questions, so label them separately.

## Investigate before optimizing

A budget failure starts a trace and hypothesis. Fix the dominant measured cost, rerun the same matrix, and retain before and after artifacts. Avoid speculative caching that adds invalidation bugs without moving the target metric.

## Validation boundary

No performance, memory, energy, launch, Simulator, or device measurements were run for this content-only batch.

## Series navigation

- Previous: [Part 76: Persistence, migration, networking, and contract tests](../2026-07-19-ios-persistence-migration-network-contract-tests/)
- Next: [Part 78: CI, flake control, test data, release qualification, and evidence](../2026-07-19-ios-ci-flake-control-test-data-release-evidence/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Xcode testing](https://developer.apple.com/documentation/xcode/testing) covers performance tests and result reporting.
- [Performance and metrics](https://developer.apple.com/documentation/xcode/performance-and-metrics) documents profiling with Instruments and Xcode Organizer.
- [MetricKit](https://developer.apple.com/documentation/metrickit) provides aggregated app diagnostics and metrics.

## Related topics

- [SwiftUI previews, tests, accessibility, and performance](../2026-07-19-swiftui-previews-testing-ui-accessibility-performance/)
- [Testing strategy, seams, and confidence](../2026-07-19-ios-testing-strategy-seams-confidence/)
