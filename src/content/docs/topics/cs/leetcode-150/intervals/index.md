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

1. [57. Insert Interval (Medium)](./057-insert-interval/)
2. [56. Merge Intervals (Medium)](./056-merge-intervals/)
3. [435. Non-overlapping Intervals (Medium)](./435-non-overlapping-intervals/)
4. [252. Meeting Rooms (Easy)](./252-meeting-rooms/)
5. [253. Meeting Rooms II (Medium)](./253-meeting-rooms-ii/)
6. [1851. Minimum Interval to Include Each Query (Hard)](./1851-minimum-interval-to-include-each-query/)

## Key patterns unlocked here

- **Linear merge after sort**, Merge / Insert Interval.
- **Sort by end + keep first**, Non-overlapping Intervals (exchange argument).
- **Sort + sweep / priority queue**, Meeting Rooms I/II.
- **Offline queries with heap**, Minimum Interval to Include Each Query.
