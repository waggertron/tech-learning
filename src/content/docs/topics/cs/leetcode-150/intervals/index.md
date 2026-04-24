---
title: Intervals
description: 6 problems covering interval merging, gap counting, and sweep-line techniques over start/end events.
parent: leetcode-150
tags: [leetcode, neetcode-150, intervals, sweep-line]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Interval problems reduce to a few techniques:

- **Sort by start, sweep once**, Merge Intervals, Insert Interval.
- **Sort by end, greedy remove overlaps**, Non-overlapping Intervals.
- **Sweep line over events**, Meeting Rooms II (count of concurrent intervals).
- **Offline query + heap / sorted structure**, Minimum Interval to Include Each Query.

## Problems

1. [57. Insert Interval](./057-insert-interval/), *Medium*
2. [56. Merge Intervals](./056-merge-intervals/), *Medium*
3. [435. Non-overlapping Intervals](./435-non-overlapping-intervals/), *Medium*
4. [252. Meeting Rooms](./252-meeting-rooms/), *Easy*
5. [253. Meeting Rooms II](./253-meeting-rooms-ii/), *Medium*
6. [1851. Minimum Interval to Include Each Query](./1851-minimum-interval-to-include-each-query/), *Hard*

## Key patterns unlocked here

- **Linear merge after sort**, Merge / Insert Interval.
- **Sort by end + keep first**, Non-overlapping Intervals (exchange argument).
- **Sort + sweep / priority queue**, Meeting Rooms I/II.
- **Offline queries with heap**, Minimum Interval to Include Each Query.
