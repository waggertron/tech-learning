---
title: Merge Intervals
description: "Sorted-boundary tactics for combining overlapping ranges and maintaining the current covered span."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Merge intervals sorts ranges by start, keeps the current merged range, and either extends it or emits it when a gap appears.

## Value

The value is a simple invariant: after sorting, any future interval that overlaps the current range must appear before the first gap.

## Challenges this solves

- collapsing overlapping ranges
- inserting a new range
- calendar union
- covered length
- conflict detection

## When to use it

Use it when ranges can be processed in start order and overlaps should become one range.

## When not to use it

Do not merge when nested or separate intervals carry distinct identities that must remain separate.

## Terminology clues

- merge all overlapping
- insert interval
- covered by
- union of intervals
- combine ranges

## Problems that use it

- [56. Merge Intervals](../coding-problems/intervals/056-merge-intervals/)
- [57. Insert Interval](../coding-problems/intervals/057-insert-interval/)
- [252. Meeting Rooms](../coding-problems/intervals/252-meeting-rooms/)
- [435. Non-overlapping Intervals](../coding-problems/intervals/435-non-overlapping-intervals/)

## Related concepts

- [Intervals](./intervals/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
- [Greedy exchange arguments](./greedy-exchange-arguments/)
