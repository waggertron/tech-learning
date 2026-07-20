---
title: CI, flake control, test data, release qualification, and evidence
description: "Govern deterministic fixtures, OS matrices, artifacts, retries, quarantine, and release gates so failures stay visible and actionable."
date: 2026-07-19
tags: [ios, swift, testing, ci, reliability, release, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-ci-flake-control-test-data-release-evidence/
series:
  slug: zero-to-ios-hero
  order: 78
---

Continuous integration should answer whether a change is safe, and preserve enough evidence to explain why it is not. A green retry with the original failure hidden does neither.

## Layer the pipeline

```text
change gate: format, static checks, domain and use-case tests
integration gate: adapters, migrations, local service contracts
UI gate: critical journeys on a small supported Simulator matrix
release gate: archive, signing checks, broader OS and device evidence
```

Run the fastest diagnostic work first. Expand destinations according to supported OS versions and known risk, not every possible permutation on every commit.

## Treat flakes as defects

Capture the first failure, result bundle, logs, screenshots, crash reports, seed, fixture version, destination, and retry outcome. Quarantine only with an owner, issue, narrow scope, and removal condition. A retry can classify intermittency; it cannot erase the failed evidence.

## Keep fixtures valid

Factories should produce a fresh valid domain object by default. Invalid fixtures should be explicit and exercise the same rejection path as production. Do not clamp or silently repair impossible ratings, dates, identifiers, or enum values in test helpers.

Automated filesystem state belongs in self-cleaning temporary directories. Manual QA fixtures need a documented reset path. Tests must not depend on execution order or state left by another job.

## Qualify a release with claims

A release checklist links each critical claim to a passing artifact: unit and contract results, UI screenshots, crash logs, accessibility review, performance baselines, archive output, and device checks. Missing hardware or account evidence remains marked unverified rather than inferred from Simulator success.

## Series navigation

- Previous: [Part 77: Performance, memory, energy, launch, and device matrices](../2026-07-19-ios-performance-memory-energy-launch-device-matrices/)
- Next: [Part 79: Networking, authentication, real-time events, and resilience](../2026-07-19-ios-networking-authentication-realtime-resilience/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Running tests and interpreting results](https://developer.apple.com/documentation/xcode/running-tests-and-interpreting-results) covers result inspection and diagnostics.
- [Organizing tests with test plans](https://developer.apple.com/documentation/xcode/organizing-tests-to-improve-feedback) covers configurations and test selection.

## Related topics

- [XCTest, XCUITest, test plans, and framework coexistence](../2026-07-19-ios-xctest-xcuitest-test-plans-coexistence/)
- [Performance, memory, energy, launch, and device matrices](../2026-07-19-ios-performance-memory-energy-launch-device-matrices/)
