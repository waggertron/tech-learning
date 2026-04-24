---
title: "56. Merge Intervals"
description: Merge all overlapping intervals in a list.
parent: intervals
tags: [leetcode, neetcode-150, intervals, sorting, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array of `intervals` where each interval is `[start, end]`, merge all overlapping intervals and return the resulting non-overlapping list.

**Example**
- `intervals = [[1,3],[2,6],[8,10],[15,18]]` → `[[1,6],[8,10],[15,18]]`
- `intervals = [[1,4],[4,5]]` → `[[1,5]]`

LeetCode 56 · [Link](https://leetcode.com/problems/merge-intervals/) · *Medium*

## Approach 1: Brute force — quadratic merge

Repeatedly find any pair of overlapping intervals and merge them until none remain.

**Complexity**
- **Time:** O(n²) or worse.
- **Space:** O(n).

## Approach 2: Sort by start + linear merge (canonical)

Sort; then walk, merging each new interval into the last of the result if they overlap, else appending.

```python
def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    result = []
    for interval in intervals:
        if result and interval[0] <= result[-1][1]:
            result[-1][1] = max(result[-1][1], interval[1])
        else:
            result.append(list(interval))
    return result
```

**Complexity**
- **Time:** O(n log n) — sort dominates.
- **Space:** O(n) output.

## Approach 3: Bucket sort (when values are bounded)

If interval endpoints are bounded (e.g., within [0, 10⁴]), use a boolean array with start/end markers in O(max_value). Rarely worth it in practice.

**Complexity**
- **Time:** O(max_value).
- **Space:** O(max_value).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Quadratic pairwise | O(n²) | O(n) |
| **Sort + linear merge** | **O(n log n)** | **O(n)** |
| Bucket sort | O(max_value) | O(max_value) |

Standard answer is sort + sweep. The same template feeds Insert Interval, Meeting Rooms II, and more.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — sort + sweep
