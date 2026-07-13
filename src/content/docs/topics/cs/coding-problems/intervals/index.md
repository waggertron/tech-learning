---
title: Intervals
description: "6 problems covering interval merging, gap counting, and sweep-line techniques over start/end events."
parent: coding-problems
tags: [leetcode, neetcode-150, intervals, sweep-line]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## The interval move

An interval problem gives you ranges, not points. The hard part is deciding what the range boundaries mean after sorting. Once intervals are ordered, most solutions become a sweep: keep the current merged range, count how many ranges are open, or decide which range to keep when two overlap.

The natural brute force compares every pair, which is usually $O(n^2)$. Sorting creates structure. If intervals are sorted by start, every later interval starts no earlier than the current one. If intervals are sorted by end, choosing the interval that finishes first leaves the most room for everything after it. If starts and ends are split into events, concurrency becomes a running count.

- **Sort by start, sweep once**: Merge Intervals, Insert Interval.
- **Sort by end, greedy remove overlaps**: Non-overlapping Intervals.
- **Sweep line over events**: Meeting Rooms II (count of concurrent intervals).
- **Offline query + heap / sorted structure**: Minimum Interval to Include Each Query.

## How to choose the shape

| Prompt shape | Sort or state | Why |
| --- | --- | --- |
| "Merge all overlapping intervals" | Sort by start, carry the active merged range | Overlap only needs comparison with the current merged end. |
| "Insert one interval into sorted non-overlapping intervals" | Copy before, merge overlaps, copy after | The input already has enough order to avoid a full re-sort. |
| "Remove minimum intervals to avoid overlap" | Sort by end, keep the earliest finishing interval | The exchange argument is about preserving future space. |
| "Can attend all meetings?" | Sort by start, check adjacent overlap | Any overlap must appear between neighbors after sorting. |
| "How many rooms/resources at once?" | Sweep starts and ends, or use a min-heap of end times | The answer is maximum concurrent active intervals. |
| "Smallest interval covering each query" | Sort intervals and queries offline, heap active candidates | Each query only needs intervals whose start is already reachable. |

Inclusive and exclusive boundaries matter. `[1, 3]` and `[3, 5]` overlap if both ends are closed. Meeting rooms usually treat a meeting ending at `3` and another starting at `3` as non-overlapping. Read the statement before writing the comparison.

## Problems

1. [57. Insert Interval (Medium)](./057-insert-interval/)
2. [56. Merge Intervals (Medium)](./056-merge-intervals/)
3. [435. Non-overlapping Intervals (Medium)](./435-non-overlapping-intervals/)
4. [252. Meeting Rooms (Easy)](./252-meeting-rooms/)
5. [253. Meeting Rooms II (Medium)](./253-meeting-rooms-ii/)
6. [1851. Minimum Interval to Include Each Query (Hard)](./1851-minimum-interval-to-include-each-query/)

## Key patterns unlocked here

- **Linear merge after sort**: Merge / Insert Interval.
- **Sort by end + keep first**: Non-overlapping Intervals (exchange argument).
- **Sort + sweep / priority queue**: Meeting Rooms I/II.
- **Offline queries with heap**: Minimum Interval to Include Each Query.

## How the problems fit together

[Merge Intervals](./056-merge-intervals/) is the base case: sort by start, keep one active range, extend or emit. [Insert Interval](./057-insert-interval/) is the same merge logic with a pre-sorted input and one new range dropped into the stream.

[Non-overlapping Intervals](./435-non-overlapping-intervals/) changes the objective. You are no longer building merged ranges. You are selecting the maximum number of compatible intervals, so the end time becomes the useful sort key.

The meeting-room problems turn overlap into resource count. [Meeting Rooms](./252-meeting-rooms/) asks whether concurrency ever exceeds one. [Meeting Rooms II](./253-meeting-rooms-ii/) asks for the peak count. [Minimum Interval to Include Each Query](./1851-minimum-interval-to-include-each-query/) is the advanced version: it combines sorted starts, sorted queries, and a heap ordered by interval length.

## Related concepts

- [Intervals](../../coding-concepts/intervals/), the broader range-modeling pattern.
- [Merge intervals](../../coding-concepts/merge-intervals/), the canonical sort-and-carry technique.
- [Sorting as preprocessing](../../coding-concepts/sorting-as-preprocessing/), why sorting often removes the nested loop.
- [Greedy exchange arguments](../../coding-concepts/greedy-exchange-arguments/), the proof shape behind sorting by earliest end.
- [Heap and priority queue](../../coding-concepts/heap-and-priority-queue/), active interval selection for meeting rooms and offline queries.
