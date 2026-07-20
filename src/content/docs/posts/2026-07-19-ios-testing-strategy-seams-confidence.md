---
title: Testing strategy, seams, and confidence
description: "Place each Field Notes risk at the lowest testing distance that can produce trustworthy evidence without mistaking coverage for confidence."
date: 2026-07-19
tags: [ios, swift, testing, strategy, confidence, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-testing-strategy-seams-confidence/
series:
  slug: zero-to-ios-hero
  order: 71
---

A testing strategy starts from product risk, not a target coverage percentage or a prescribed pyramid. Put each claim at the lowest distance that can actually prove it.

## Build a risk matrix

| Risk | Cheapest trustworthy evidence | Why |
| --- | --- | --- |
| title invariant | domain unit test | no framework behavior involved |
| save orchestration | use-case test with in-memory library | proves success and failure policy |
| SwiftData mapping | adapter contract with temporary store | translation is the risk |
| deep-link wiring | UI integration test | framework navigation must participate |
| VoiceOver order | accessibility audit and device check | semantics and interaction matter |
| launch budget | measured supported device matrix | simulator timing cannot prove device cost |

Use a few long journeys for composition. Keep combinatorial rule cases near pure code where failures are fast and precise.

## Design seams around uncertainty

Inject time, identifiers, network transport, persistence, and scheduling because they are variable or external. Do not create an interface for a pure function solely to mock it. A seam should lower setup cost, permit a deterministic substitute, or isolate a failure policy.

## Define confidence by claims

Green tests provide confidence only for the environments and behavior they exercised. A Linux Swift test can prove standard-library domain logic. It cannot prove SwiftUI layout, UIKit lifecycle, signing, entitlements, simulator integration, or physical-device performance.

Track unverified claims beside passing evidence. That keeps missing device and account checks visible without blocking unrelated lessons.

## Series navigation

- Previous: [Part 70: Architecture tests, refactoring seams, decisions, and tradeoffs](../2026-07-19-ios-architecture-tests-refactoring-decisions-tradeoffs/)
- Next: [Part 72: Swift Testing fundamentals and parameterized tests](../2026-07-19-swift-testing-fundamentals-parameterized-tests/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Swift Testing](https://developer.apple.com/documentation/testing) documents Swift's unit-testing framework.
- [Xcode testing](https://developer.apple.com/documentation/xcode/testing) covers test targets, plans, execution, and reports.

## Related topics

- [SwiftUI previews, tests, accessibility, and performance](../2026-07-19-swiftui-previews-testing-ui-accessibility-performance/)
- [UIKit Field Notes capstone](../2026-07-19-uikit-field-notes-capstone/)
