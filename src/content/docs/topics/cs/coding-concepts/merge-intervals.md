---
title: Merge Intervals
description: "Sorted-boundary tactics for combining overlapping ranges and maintaining the current covered span."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Merge intervals sorts ranges by start, then keeps the current covered span. Each new interval either extends the current span or starts a separate span.

The invariant is that the output built so far is sorted and non-overlapping. The last output interval is the only interval that can overlap the next sorted input interval.

This removes most of the apparent case explosion. You only compare `next.start` with `current.end`, then either update `current.end` or append a new interval.

## Value

The value is localizing overlap. Without ordering, every interval might conflict with many others. With ordering, overlap collapses into one comparison against the active merged span.

### Direct complexity example

- **Brute force:** Repeatedly compare and merge arbitrary pairs until stable: $O(n^2)$ time and $O(n)$ output space.
- **With this tactic:** Sort by start and scan once: $O(n \log n)$ time and $O(n)$ output space.
- **Space:** If the input can be mutated and output can reuse storage, auxiliary space beyond sorting can be $O(1)$, not counting the result.

## Challenges this solves

- merge overlapping ranges
- insert a new interval
- coverage union
- meeting conflict detection
- range normalization before later work

## When to use it

Use this tactic when these conditions are true:

- the desired answer is a union of ranges
- intervals can be sorted by start
- only the latest merged span matters
- touching endpoints have a clear overlap rule

## When not to use it

Reach for a different tactic when these warning signs appear:

- the problem asks for maximum number of simultaneous intervals, which points to sweep or heap
- queries arrive online after preprocessing
- intervals live in multiple dimensions
- the original interval identities must all remain separate

## Terminology clues

These prompt words often point toward this concept:

- merge
- insert interval
- overlap
- covered range
- union of intervals
- non-overlapping output
- start time

## Problems that use it

- [56. Merge Intervals](../../coding-problems/intervals/056-merge-intervals/)
- [57. Insert Interval](../../coding-problems/intervals/057-insert-interval/)
- [252. Meeting Rooms](../../coding-problems/intervals/252-meeting-rooms/)
- [435. Non-overlapping Intervals](../../coding-problems/intervals/435-non-overlapping-intervals/)

## Related concepts

- [Intervals](../intervals/)
- [Sorting as preprocessing](../sorting-as-preprocessing/)
- [Greedy exchange arguments](../greedy-exchange-arguments/)
