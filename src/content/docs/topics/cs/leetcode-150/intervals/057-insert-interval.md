---
title: "57. Insert Interval"
description: Insert a new interval into a non-overlapping sorted list, merging as needed.
parent: intervals
tags: [leetcode, neetcode-150, intervals, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `intervals` sorted by start (non-overlapping) and a new `newInterval`, insert it into `intervals` such that the result is still non-overlapping (merge as necessary).

**Example**
- `intervals = [[1,3],[6,9]]`, `newInterval = [2,5]` → `[[1,5],[6,9]]`
- `intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]]`, `newInterval = [4,8]` → `[[1,2],[3,10],[12,16]]`

LeetCode 57 · [Link](https://leetcode.com/problems/insert-interval/) · *Medium*

## Approach 1: Brute force — append and merge

Add to list, sort, run Merge Intervals.

**Complexity**
- **Time:** O(n log n).
- **Space:** O(n).

## Approach 2: Binary search for insertion point + left-merge + right-merge

Find where `newInterval` goes; then walk left and right, merging overlaps.

Same O(n) in the worst case.

## Approach 3: Single linear pass (canonical, O(n))

Three phases over the sorted list:

1. Copy all intervals strictly before `newInterval`.
2. Merge any overlapping with `newInterval`.
3. Copy the rest.

```python
def insert(intervals, new_interval):
    result = []
    i = 0
    n = len(intervals)

    # 1. before
    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1

    # 2. overlap
    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval = [min(new_interval[0], intervals[i][0]),
                        max(new_interval[1], intervals[i][1])]
        i += 1
    result.append(new_interval)

    # 3. after
    while i < n:
        result.append(intervals[i])
        i += 1

    return result
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Append + re-merge | O(n log n) | O(n) |
| Binary search + local merge | O(n) | O(n) |
| **Single-pass three-phase** | **O(n)** | **O(n)** |

The three-phase template is the cleanest answer.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — sorted list of intervals; in-place walk
