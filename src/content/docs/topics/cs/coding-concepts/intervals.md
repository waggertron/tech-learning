---
title: Intervals
description: "Range-boundary tactics for overlap, containment, scheduling, and sweep-line problems."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Interval tactics reduce each object to a start and end boundary. Sorting by one boundary makes overlaps and gaps visible as a scan.

## Value

The value is turning geometry into ordering. Most interval problems are not about the payload, they are about how boundaries compare.

## Challenges this solves

- merge overlapping ranges
- insert a range
- minimum rooms or resources
- remove overlaps
- answer stabbing queries

## When to use it

Use it when inputs are ranges, meetings, bookings, spans, or start/end pairs.

## When not to use it

Do not treat interval problems as plain arrays when boundary order and overlap state are the real information.

## Terminology clues

- start and end
- meeting
- booking
- overlap
- merge
- non-overlapping
- cover

## Problems that use it

- [56. Merge Intervals](../coding-problems/intervals/056-merge-intervals/)
- [57. Insert Interval](../coding-problems/intervals/057-insert-interval/)
- [253. Meeting Rooms II](../coding-problems/intervals/253-meeting-rooms-ii/)
- [435. Non-overlapping Intervals](../coding-problems/intervals/435-non-overlapping-intervals/)

## Related concepts

- [Merge intervals](./merge-intervals/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
- [Difference arrays](./difference-arrays/)
