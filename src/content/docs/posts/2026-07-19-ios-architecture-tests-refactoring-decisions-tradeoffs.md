---
title: Architecture tests, refactoring seams, decisions, and tradeoffs
description: "Prove architecture through fast domain tests, use-case fakes, adapter contracts, composition checks, and revisable decision records."
date: 2026-07-19
tags: [ios, swift, architecture, testing, refactoring, decisions, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-architecture-tests-refactoring-decisions-tradeoffs/
series:
  slug: zero-to-ios-hero
  order: 70
---

Architecture proves its value through outcomes: important rules are cheap to test, integrations fail at known boundaries, composition is visible, and change does not require a rewrite.

## Match tests to boundaries

| Boundary | Evidence | Useful failure |
| --- | --- | --- |
| domain value | direct examples and boundaries | invalid tag or coordinate is rejected |
| use case | in-memory port plus fixed clock and ID | save failure does not report success |
| adapter | shared contract suite | local and persistent stores disagree |
| composition | narrow integration or launch test | production graph omits a dependency |
| critical journey | UI acceptance test | correct parts are wired incorrectly |

Mocking every type would test call choreography instead of product behavior. Prefer real values and small deterministic adapters until an interaction itself is the contract.

## Refactor through a seam

To replace direct storage calls, first characterize existing save behavior. Introduce a purpose-named function or port at the caller, move one path behind it, compare outcomes, then remove the old path. A seam permits incremental migration and rollback.

## Record the decision

An architecture decision record should state:

- the product and engineering pressure
- the chosen boundary and dependency direction
- alternatives considered
- costs and known limitations
- evidence that supports the choice
- a signal and date for review

The record preserves reasoning, not permanence. When pressure changes, revise the graph in small tested moves.

## Measure the right things

Folder symmetry, protocol counts, and pattern purity are weak signals. Watch time to add behavior, test duration, failure containment, build time, onboarding friction, and how often one feature requires unrelated edits.

## Series navigation

- Previous: [Part 69: Concurrency architecture, isolation, cancellation, and lifecycle](../2026-07-19-ios-concurrency-architecture-isolation-cancellation-lifecycle/)
- Next: [Part 71: Testing strategy, seams, and confidence](../2026-07-19-ios-testing-strategy-seams-confidence/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Swift Testing](https://developer.apple.com/documentation/testing) provides native Swift behavior tests.
- [Swift Package Manager](https://www.swift.org/documentation/package-manager/) supplies module and test-target boundaries.

## Related topics

- [Architecture starts with pressure](../2026-07-19-ios-architecture-starts-with-pressure/)
- [Dependency injection and the composition root](../2026-07-19-ios-dependency-injection-composition-root/)
