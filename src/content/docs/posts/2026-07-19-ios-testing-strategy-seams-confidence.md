---
title: Testing strategy, seams, and confidence
description: "Place each Field Notes risk at the lowest testing distance that can produce trustworthy evidence without mistaking coverage for confidence."
date: 2026-07-19
tags: [ios, swift, testing, strategy, confidence, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-testing-strategy-seams-confidence/
series:
  slug: zero-to-ios-hero
  order: 70
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

## Change a requirement without changing the framework

Suppose search initially matches titles only. A new requirement says a query must also find body text and tags, ignoring case. Keep this rule in `NoteLibrary.notes(matching:)`, so both interface adapters receive the same result.

The companion's existing `searchCoversVisibleFields` test captures the three cases:

```swift
@Test("Search covers title, body, and tags", arguments: [
    ("redwood", FieldNotesFixtures.redwood.id),
    ("anemones", FieldNotesFixtures.tidePools.id),
    ("MORNING", FieldNotesFixtures.redwood.id),
])
func searchCoversVisibleFields(query: String, expectedID: NoteID) async throws {
    let library = NoteLibrary(repository: FieldNotesFixtures.repository())
    let notes = try await library.notes(matching: query)
    #expect(notes.map(\.id) == [expectedID])
}
```

A title-only implementation passes the first case and misses the body/tag cases. The current implementation normalizes the query and checks all three fields before applying the existing stable ordering. Neither SwiftUI nor UIKit needs its own search policy. Run the companion package tests to inspect the actual behavior; this example describes the requirement transition rather than claiming a newly observed historical test failure.

## Refactor through a seam

Before replacing direct storage calls, characterize the visible save behavior. Introduce the `NoteRepository` boundary at the caller, move one path behind it, run the same contract against the old and new adapters, then remove the obsolete path. The file-backed and in-memory repositories should agree about IDs and mutation results even though only one needs disk recovery tests.

A useful architecture decision record names the pressure, chosen boundary, alternatives, costs, supporting evidence, and a signal to revisit it. In Field Notes, the pressure is durable local saves without putting filesystem code in either interface. The cost is an explicit mapping and contract suite. Revisit the choice when query or migration needs outgrow the file format.

Measure change cost and failure containment rather than protocol count. An extra interface is useful when it isolates a real variable or lets the same behavior run with a deterministic substitute.

## Define confidence by claims

Green tests provide confidence only for the environments and behavior they exercised. A Linux Swift test can prove standard-library domain logic. It cannot prove SwiftUI layout, UIKit lifecycle, signing, entitlements, simulator integration, or physical-device performance.

Track unverified claims beside passing evidence. That keeps missing device and account checks visible without blocking unrelated lessons.

## Series navigation

- Previous: [Part 69: Concurrency architecture, isolation, cancellation, and lifecycle](../2026-07-19-ios-concurrency-architecture-isolation-cancellation-lifecycle/)
- Next: [Part 71: Swift Testing fundamentals and parameterized tests](../2026-07-19-swift-testing-fundamentals-parameterized-tests/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Swift Testing](https://developer.apple.com/documentation/testing) documents Swift's unit-testing framework.
- [Xcode testing](https://developer.apple.com/documentation/xcode/testing) covers test targets, plans, execution, and reports.

## Related topics

- [SwiftUI previews, tests, accessibility, and performance](../2026-07-19-swiftui-previews-testing-ui-accessibility-performance/)
- [UIKit Field Notes capstone](../2026-07-19-uikit-field-notes-capstone/)
