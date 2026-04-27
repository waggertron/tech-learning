---
title: "57. Insert Interval (Medium)"
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

## Approach 1: Brute force, append and merge

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
    result = []                   # L1: O(1) setup
    i = 0                         # L2: O(1)
    n = len(intervals)            # L3: O(1)

    # 1. before
    while i < n and intervals[i][1] < new_interval[0]:   # L4: O(1) per check
        result.append(intervals[i])                        # L5: O(1) per append
        i += 1

    # 2. overlap
    while i < n and intervals[i][0] <= new_interval[1]:  # L6: O(1) per check
        new_interval = [min(new_interval[0], intervals[i][0]),
                        max(new_interval[1], intervals[i][1])]  # L7: O(1) per merge
        i += 1
    result.append(new_interval)   # L8: O(1)

    # 3. after
    while i < n:                  # L9: O(1) per check
        result.append(intervals[i])  # L10: O(1) per append
        i += 1

    return result
```

**Where the time goes, line by line**

*Variables: n = len(intervals) (the existing intervals; newInterval is a single interval).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L4, L5 (phase 1 copy) | O(1) each | up to n | O(n) |
| L6, L7 (phase 2 merge) | O(1) each | up to n | O(n) |
| L8 (insert merged) | O(1) | 1 | O(1) |
| **L9, L10 (phase 3 copy)** | **O(1) each** | **up to n** | **O(n)** ← all phases together |

No phase dominates; every interval is visited exactly once across the three phases. Total work is O(n) with no sorting because the input is already sorted.

**Complexity**
- **Time:** O(n), driven by the single pass across all three phases (L4-L10).
- **Space:** O(n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Append + re-merge | O(n log n) | O(n) |
| Binary search + local merge | O(n) | O(n) |
| **Single-pass three-phase** | **O(n)** | **O(n)** |

The three-phase template is the cleanest answer.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_057_insert_interval.py and run.
# Uses the canonical implementation (Approach 3).

def insert(intervals, new_interval):
    result = []
    i = 0
    n = len(intervals)

    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1

    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval = [min(new_interval[0], intervals[i][0]),
                        max(new_interval[1], intervals[i][1])]
        i += 1
    result.append(new_interval)

    while i < n:
        result.append(intervals[i])
        i += 1

    return result

def _run_tests():
    # Example 1 from problem statement
    assert insert([[1,3],[6,9]], [2,5]) == [[1,5],[6,9]]
    # Example 2: spans multiple intervals
    assert insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]) == [[1,2],[3,10],[12,16]]
    # Insert at the start (no overlap)
    assert insert([[3,5],[6,9]], [1,2]) == [[1,2],[3,5],[6,9]]
    # Insert at the end (no overlap)
    assert insert([[1,2],[3,5]], [7,9]) == [[1,2],[3,5],[7,9]]
    # Completely subsumes all existing intervals
    assert insert([[1,2],[3,4],[5,6]], [0,10]) == [[0,10]]
    # Empty intervals list
    assert insert([], [1,5]) == [[1,5]]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), sorted list of intervals; in-place walk
