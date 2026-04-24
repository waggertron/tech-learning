---
title: "252. Meeting Rooms"
description: Determine if a person can attend all meetings (no overlapping intervals).
parent: intervals
tags: [leetcode, neetcode-150, intervals, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array of meeting time intervals `[start, end]`, determine if a person could attend all meetings.

**Example**
- `intervals = [[0,30],[5,10],[15,20]]` → `false`
- `intervals = [[7,10],[2,4]]` → `true`

LeetCode 252 (premium) · [Link](https://leetcode.com/problems/meeting-rooms/) · *Easy*

## Approach 1: Brute force, check every pair

Compare every pair of intervals for overlap.

```python
def can_attend_meetings(intervals):
    n = len(intervals)
    for i in range(n):
        for j in range(i + 1, n):
            a, b = intervals[i], intervals[j]
            if a[0] < b[1] and b[0] < a[1]:
                return False
    return True
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

## Approach 2: Sort by start + check adjacent (canonical)

Sort. If any meeting's start is earlier than the previous meeting's end, there's a conflict.

```python
def can_attend_meetings(intervals):
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i, 1][1]:
            return False
    return True
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(1).

## Approach 3: Sweep line on events

Decompose into `+1` (start) and `-1` (end) events; sort by time with `-1` before `+1` on ties; running sum must stay ≤ 1.

```python
def can_attend_meetings(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort(key=lambda x: (x[0], x[1]))   # end before start on ties
    cur = 0
    for _, delta in events:
        cur += delta
        if cur > 1:
            return False
    return True
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(n).

Useful when the next problem (Meeting Rooms II) extends the counting.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Every pair | O(n²) | O(1) |
| **Sort + adjacent check** | **O(n log n)** | **O(1)** |
| Sweep-line events | O(n log n) | O(n) |

Sort + adjacent check is the shortest. Sweep-line generalizes to "how many rooms at peak" (252 → 253).

## Related data structures

- [Arrays](../../../data-structures/arrays/), sort + linear scan
