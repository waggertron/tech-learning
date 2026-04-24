---
title: "435. Non-overlapping Intervals"
description: Minimum number of intervals to remove so the remainder are non-overlapping.
parent: intervals
tags: [leetcode, neetcode-150, intervals, greedy, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array of intervals, return the minimum number of intervals to remove so the remainder are non-overlapping. (Intervals touching at endpoints are *not* considered overlapping.)

**Example**
- `intervals = [[1,2],[2,3],[3,4],[1,3]]` → `1` (remove [1,3])
- `intervals = [[1,2],[1,2],[1,2]]` → `2`
- `intervals = [[1,2],[2,3]]` → `0`

LeetCode 435 · [Link](https://leetcode.com/problems/non-overlapping-intervals/) · *Medium*

## Approach 1: DP — LIS-like

Sort by start; find the longest chain of non-overlapping intervals; answer = n − longest.

```python
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    n = len(intervals)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if intervals[j][1] <= intervals[i][0]:
                dp[i] = max(dp[i], dp[j] + 1)
    return n - max(dp, default=0)
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(n).

## Approach 2: Greedy — sort by end, keep earliest ends

Classic interval-scheduling: sort by end; greedily pick the interval with the smallest end that doesn't conflict with the previous pick.

```python
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[1])
    count = 0
    end = float('-inf')
    for s, e in intervals:
        if s >= end:
            end = e
        else:
            count += 1
    return count
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(1).

### Why "sort by end" is the right greedy
Keeping the interval with the smallest end frees the most room for subsequent intervals — any optimal solution can be rewritten to include it (exchange argument). This is the **interval scheduling maximization** template.

## Approach 3: Sort by start, remove on conflict (equivalent)

Sort by start; when two overlap, remove the one with the larger end (since it blocks more future intervals).

```python
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    count = 0
    prev_end = float('-inf')
    for s, e in intervals:
        if s >= prev_end:
            prev_end = e
        else:
            count += 1
            prev_end = min(prev_end, e)   # keep the smaller end
    return count
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| LIS DP | O(n²) | O(n) |
| **Sort by end, greedy** | **O(n log n)** | **O(1)** |
| Sort by start, remove on conflict | O(n log n) | O(1) |

Interval scheduling is a canonical greedy. The proof-by-exchange argument is worth knowing.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — sort + single pass
