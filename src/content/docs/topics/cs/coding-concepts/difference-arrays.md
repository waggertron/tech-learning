---
title: Difference Arrays
description: "Range-update tactics that mark changes at boundaries and recover final values with a prefix scan."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

A difference array stores how the value changes at each boundary instead of storing every updated cell. Add at the start, subtract after the end, then prefix-scan once to materialize the final array.

## Value

The value is batching. Many range updates become $O(1)$ boundary marks plus one final $O(n)$ pass.

## Challenges this solves

- range increment updates
- booking or capacity timelines
- interval overlap counts
- offline update batches
- sweep-line counters

## When to use it

Use it when the problem gives many range updates and asks for final values or maximum overlap after all updates.

## When not to use it

Do not use it when updates and queries are interleaved online. That calls for a Fenwick tree, segment tree, balanced map, or heap depending on the query.

## Terminology clues

- increment every index from l to r
- bookings
- range update
- capacity over time
- after all operations
- difference array

## Problems that use it

- [253. Meeting Rooms II](../coding-problems/intervals/253-meeting-rooms-ii/)
- [1851. Minimum Interval to Include Each Query](../coding-problems/intervals/1851-minimum-interval-to-include-each-query/)
- [303. Range Sum Query Immutable](../coding-problems/arrays-and-hashing/303-range-sum-query-immutable/)

## Related concepts

- [Prefix sums](./prefix-sums/)
- [Intervals](./intervals/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
