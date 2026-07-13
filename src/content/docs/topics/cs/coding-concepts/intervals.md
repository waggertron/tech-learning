---
title: Intervals
description: "Range-boundary tactics for overlap, containment, scheduling, and sweep-line problems."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Intervals model a span with a start and an end. The tactic is to stop thinking about individual points and reason about boundaries, overlap, containment, and active ranges.

The invariant usually comes from sorted starts or sorted events. Once intervals are ordered, the current interval only needs to compare against the last kept interval, the next starting boundary, or the active count.

Before coding, clarify endpoint semantics. `[1, 2]` and `[2, 3]` may overlap in one problem and not overlap in another. That single equality choice changes merge, meeting-room, and removal logic.

## Value

The value is reducing many case splits to boundary comparisons. Sorting by start, end, or query value makes overlap logic local instead of pairwise.

### Direct complexity example

- **Brute force:** Check every interval against every other interval for conflicts: $O(n^2)$ time and $O(1)$ to $O(n)$ space.
- **With this tactic:** Sort by boundary and scan, heap, or sweep events: $O(n \log n)$ time, often with $O(1)$ to $O(n)$ space.
- **Space:** A heap or event list uses $O(n)$ space when many intervals can be active at once.

## Challenges this solves

- merge and insert intervals
- meeting room counts
- non-overlapping removals
- range coverage
- minimum interval for queries

## When to use it

Use this tactic when these conditions are true:

- items have start and end boundaries
- the question asks about overlap, containment, scheduling, or coverage
- ordering by start or end makes the next conflict local
- endpoint inclusivity can be stated clearly

## When not to use it

Reach for a different tactic when these warning signs appear:

- the ranges change online and need dynamic interval structures
- the problem is about arbitrary graph connectivity rather than line order
- the endpoints are not comparable
- the prompt needs every individual point and the range model loses information

## Terminology clues

These prompt words often point toward this concept:

- interval
- range
- start
- end
- overlap
- meeting
- schedule
- cover

## Problems that use it

- [56. Merge Intervals](../../coding-problems/intervals/056-merge-intervals/)
- [57. Insert Interval](../../coding-problems/intervals/057-insert-interval/)
- [252. Meeting Rooms](../../coding-problems/intervals/252-meeting-rooms/)
- [253. Meeting Rooms II](../../coding-problems/intervals/253-meeting-rooms-ii/)
- [435. Non-overlapping Intervals](../../coding-problems/intervals/435-non-overlapping-intervals/)
- [1851. Minimum Interval to Include Each Query](../../coding-problems/intervals/1851-minimum-interval-to-include-each-query/)

## Related concepts

- [Merge intervals](../merge-intervals/)
- [Sorting as preprocessing](../sorting-as-preprocessing/)
- [Difference arrays](../difference-arrays/)
