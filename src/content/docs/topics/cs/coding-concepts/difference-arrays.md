---
title: Difference Arrays
description: "Range-update tactics that mark changes at boundaries and recover final values with a prefix scan."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Difference arrays mark changes at boundaries instead of touching every value inside a range. Adding `x` to `[l, r]` becomes `diff[l] += x` and `diff[r + 1] -= x`.

The invariant is that a prefix scan over the difference array reconstructs the actual values. Every range update starts an effect at its left boundary and cancels it immediately after its right boundary.

This is the right tool when all updates can be recorded first and materialized later. It is also the simpler version of sweep-line event processing: start events increase active state, end events decrease it.

## Value

The value is turning many wide updates into small boundary writes. The wider the ranges, the more dramatic the saving.

### Direct complexity example

- **Brute force:** Apply `m` range updates directly over an array of length `n`: $O(mn)$ worst-case time and $O(1)$ extra space.
- **With this tactic:** Record two boundary events per update and scan once: $O(n + m)$ time and $O(n)$ space.
- **Space:** Coordinate compression can reduce the space when the coordinate range is huge but only a small number of boundaries appear.

## Challenges this solves

- range increment updates
- flight bookings and car pooling capacity
- overlap counts
- offline interval effects
- line sweep over start and end events

## When to use it

Use this tactic when these conditions are true:

- many operations affect every index in a contiguous range
- the final array or final maximum is needed after all updates
- updates are offline or can be batched
- range boundaries carry all the information

## When not to use it

Reach for a different tactic when these warning signs appear:

- queries must be answered online between updates
- updates are not contiguous ranges
- the operation cannot be undone by an inverse boundary marker
- the coordinate range is enormous and uncompressed

## Terminology clues

These prompt words often point toward this concept:

- range update
- increment each
- bookings
- capacity over time
- start and end
- difference array
- sweep
- after all operations

## Problems that use it

- [253. Meeting Rooms II](../coding-problems/intervals/253-meeting-rooms-ii/)
- [303. Range Sum Query - Immutable](../coding-problems/arrays-and-hashing/303-range-sum-query-immutable/)
- [1851. Minimum Interval to Include Each Query](../coding-problems/intervals/1851-minimum-interval-to-include-each-query/)

## Related concepts

- [Prefix sums](./prefix-sums/)
- [Intervals](./intervals/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
