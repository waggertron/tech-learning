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

## Approach 1: DP, LIS-like

Sort by start; find the longest chain of non-overlapping intervals; answer = n minus longest.

```python
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[0])   # L1: O(n log n)
    n = len(intervals)                    # L2: O(1)
    dp = [1] * n                          # L3: O(n)
    for i in range(1, n):                 # L4: outer loop, n-1 iterations
        for j in range(i):                # L5: inner loop, up to i iterations
            if intervals[j][1] <= intervals[i][0]:   # L6: O(1) overlap check
                dp[i] = max(dp[i], dp[j] + 1)        # L7: O(1) update
    return n - max(dp, default=0)         # L8: O(n) scan dp
```

**Where the time goes, line by line**

*Variables: n = len(intervals).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (sort) | O(n log n) | 1 | O(n log n) |
| L2, L3 (init) | O(n) | 1 | O(n) |
| L4 (outer loop) | O(1) | n-1 | O(n) |
| **L5 (inner loop)** | **O(1)** | **O(n) per outer iter** | **O(n²)** ← dominates |
| L6, L7 (body) | O(1) | O(n²) total | O(n²) |
| L8 (max scan) | O(n) | 1 | O(n) |

The nested loops are the classic O(n²) LIS pattern. L5 runs 0+1+2+...+(n-1) = n(n-1)/2 times total.

**Complexity**
- **Time:** O(n²), driven by L5 (the nested inner loop).
- **Space:** O(n) for the dp array.

## Approach 2: Greedy, sort by end, keep earliest ends

Classic interval-scheduling: sort by end; greedily pick the interval with the smallest end that doesn't conflict with the previous pick.

```python
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[1])   # L1: O(n log n)
    count = 0                             # L2: O(1)
    end = float('-inf')                   # L3: O(1)
    for s, e in intervals:               # L4: outer loop, n iterations
        if s >= end:                     # L5: O(1) non-overlap check
            end = e                      # L6: O(1) keep this interval
        else:
            count += 1                   # L7: O(1) remove this interval
    return count                         # L8: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(intervals).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (sort)** | **O(n log n)** | **1** | **O(n log n)** ← dominates |
| L2, L3 (init) | O(1) | 1 | O(1) |
| L4 (loop) | O(1) | n | O(n) |
| L5-L7 (body) | O(1) | n | O(n) |
| L8 (return) | O(1) | 1 | O(1) |

After the sort, a single linear pass does all the work. Each interval is examined once, and the decision (keep or remove) is made in O(1) by comparing its start to the running `end` variable.

**Complexity**
- **Time:** O(n log n), driven by L1 (sort).
- **Space:** O(1) extra; only two scalar variables beyond the (sorted) input.

### Why "sort by end" is the right greedy
Keeping the interval with the smallest end frees the most room for subsequent intervals, any optimal solution can be rewritten to include it (exchange argument). This is the **interval scheduling maximization** template.

## Approach 3: Sort by start, remove on conflict (equivalent)

Sort by start; when two overlap, remove the one with the larger end (since it blocks more future intervals).

```python
def erase_overlap_intervals(intervals):
    intervals.sort(key=lambda x: x[0])   # L1: O(n log n)
    count = 0                             # L2: O(1)
    prev_end = float('-inf')              # L3: O(1)
    for s, e in intervals:               # L4: outer loop, n iterations
        if s >= prev_end:                # L5: O(1) non-overlap check
            prev_end = e                 # L6: O(1) accept interval
        else:
            count += 1                   # L7: O(1) remove this interval
            prev_end = min(prev_end, e)  # L8: O(1) keep the smaller end
    return count                         # L9: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(intervals).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (sort)** | **O(n log n)** | **1** | **O(n log n)** ← dominates |
| L2, L3 (init) | O(1) | 1 | O(1) |
| L4 (loop) | O(1) | n | O(n) |
| L5-L8 (body) | O(1) | n | O(n) |
| L9 (return) | O(1) | 1 | O(1) |

Identical cost structure to Approach 2. The difference is the sort key (start vs. end) and the tie-breaking rule on conflict (keep the smaller end explicitly via `min`). Both approaches are O(n log n) dominated by the sort.

**Complexity**
- **Time:** O(n log n), driven by L1 (sort).
- **Space:** O(1) extra.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| LIS DP | O(n²) | O(n) |
| **Sort by end, greedy** | **O(n log n)** | **O(1)** |
| Sort by start, remove on conflict | O(n log n) | O(1) |

Interval scheduling is a canonical greedy. The proof-by-exchange argument is worth knowing.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_435.py and run.
# Uses the canonical implementation (Approach 2: greedy sort by end).

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

def _run_tests():
    assert erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]]) == 1   # example 1
    assert erase_overlap_intervals([[1,2],[1,2],[1,2]]) == 2         # example 2
    assert erase_overlap_intervals([[1,2],[2,3]]) == 0               # example 3: touching only
    assert erase_overlap_intervals([[1,5]]) == 0                     # single interval
    assert erase_overlap_intervals([]) == 0                          # empty
    assert erase_overlap_intervals([[1,100],[2,3],[4,5],[6,7]]) == 1 # one giant overlaps many
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), sort + single pass
