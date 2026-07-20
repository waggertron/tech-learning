---
title: iOS architecture starts with pressure
description: "Score Field Notes boundaries by change, test, integration, lifetime, criticality, and team pressure before choosing an architecture pattern."
date: 2026-07-19
tags: [ios, swift, architecture, design, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-architecture-starts-with-pressure/
series:
  slug: zero-to-ios-hero
  order: 59
---

Architecture is a response to pressure. A pattern earns its cost when it protects behavior from a change, lifetime, test, integration, or ownership problem the product actually has.

## Name the pressure first

Field Notes has several different pressures:

| Feature | Change | Criticality | External dependency | Lifetime | Useful boundary |
| --- | --- | --- | --- | --- | --- |
| title validation | low | high | none | one command | domain value or use case |
| note storage | medium | high | database | app lifetime | repository contract |
| weather context | high | low | network | cancellable request | client contract |
| editor focus | medium | low | UI framework | one presentation | keep in UI adapter |
| sync | high | high | server and disk | background and retry | explicit state machine and ports |

One architecture label cannot answer all five rows.

## Score a proposed boundary

Add a boundary when it buys at least one concrete outcome:

- a business rule runs without UI, storage, or network setup
- SwiftUI and UIKit reuse the same application behavior
- a local adapter replaces a cloud or device dependency
- cancellation, transaction, authorization, or retry has one owner
- team ownership or build isolation reduces real coordination cost

Keep code direct when a wrapper only renames a framework call, has one trivial implementation, and protects no rule or volatile dependency.

## Draw dependency direction

```text
SwiftUI and UIKit adapters
           |
           v
   application use cases
           |
           v
      domain policies
           ^
           |
storage, network, clock, ID, and device adapters
```

The arrows represent source dependencies. Runtime calls can travel outward through interfaces owned by the application layer.

## Revisit decisions with evidence

Record the pressure, chosen boundary, rejected alternatives, cost, and signal that would trigger review. Folder symmetry and protocol count are not architecture outcomes. Change cost, test distance, failure isolation, and ownership clarity are.

## Validation boundary

The scorecard is a design tool, not runtime evidence. Its value must be checked against actual Field Notes changes, tests, build times, failures, and team work.

## Series navigation

- Previous: [Part 58: UIKit Field Notes capstone](../2026-07-19-uikit-field-notes-capstone/)
- Next: [Part 60: MVC and controller boundaries](../2026-07-19-ios-mvc-controller-boundaries/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Swift Package Manager](https://www.swift.org/documentation/package-manager/) supplies module boundaries when they earn their cost.
- [SwiftUI model data](https://developer.apple.com/documentation/swiftui/model-data) shows framework-level data flow.
- [URLSession](https://developer.apple.com/documentation/foundation/urlsession) is one external adapter boundary used by Field Notes.

## Related topics

- [SwiftUI Field Notes capstone](../2026-07-19-swiftui-field-notes-capstone/)
- [UIKit Field Notes capstone](../2026-07-19-uikit-field-notes-capstone/)
