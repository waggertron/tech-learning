---
title: "56. Merge Intervals (Medium)"
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

## Approach 1: Brute force, quadratic merge

Repeatedly find any pair of overlapping intervals and merge them until none remain.

```python
def merge(intervals):
    intervals = [list(iv) for iv in intervals]
    changed = True
    while changed:                         # L1: outer fixed-point loop
        changed = False
        result = []
        for iv in intervals:               # L2: scan every interval
            for existing in result:        # L3: against every kept one
                if iv[0] <= existing[1] and existing[0] <= iv[1]:
                    existing[0] = min(existing[0], iv[0])
                    existing[1] = max(existing[1], iv[1])
                    changed = True
                    break
            else:
                result.append(iv)
        intervals = result
    return intervals
```

Each outer pass touches every pair (L2 × L3 = O(n²)). The outer loop runs until a pass produces no merges; in the worst case (a chain like `[[1,2],[2,3],[3,4],...]`) that's another O(n) factor → O(n³) overall.

**Complexity**
- **Time:** O(n²) or worse.
- **Space:** O(n).

## Approach 2: Sort by start + linear merge (canonical)

Sort; then walk, merging each new interval into the last of the result if they overlap, else appending.

```python
def merge(intervals):
    intervals.sort(key=lambda x: x[0])   # L1: O(n log n)
    result = []                            # L2: O(1) setup
    for interval in intervals:             # L3: O(n) iterations
        if result and interval[0] <= result[-1][1]:    # L4: O(1) check
            result[-1][1] = max(result[-1][1], interval[1])  # L5: O(1) extend
        else:
            result.append(list(interval))  # L6: O(1) amortized
    return result
```

**Where the time goes, line by line**

*Variables: n = len(intervals).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (sort)** | **O(n log n)** | **1** | **O(n log n)** ← dominates |
| L2 (init) | O(1) | 1 | O(1) |
| L3 (loop) | O(1) | n | O(n) |
| L4 (overlap check) | O(1) | n | O(n) |
| L5 (extend) | O(1) | up to n | O(n) |
| L6 (append) | O(1) amortized | up to n | O(n) |

L1 dominates: sorting requires O(n log n) comparisons, and the linear sweep that follows is O(n). Everything after the sort is a single pass.

**Complexity**
- **Time:** O(n log n), driven by L1 (the sort).
- **Space:** O(n) output.

## Approach 3: Bucket sort (when values are bounded)

If interval endpoints are bounded (e.g., within [0, 10⁴]), tally start and end events into counter arrays, then sweep tracking open intervals. Each closed run produces one merged interval.

```python
def merge(intervals):
    if not intervals:
        return []
    max_v = max(e for _, e in intervals)
    starts = [0] * (max_v + 2)
    ends = [0] * (max_v + 2)
    for s, e in intervals:
        starts[s] += 1
        ends[e] += 1

    result = []
    open_count = 0
    cur_start = None
    for i in range(max_v + 2):
        if starts[i] > 0 and open_count == 0:
            cur_start = i
        open_count += starts[i]                # process starts before ends so touching merges
        if ends[i] > 0:
            open_count -= ends[i]
            if open_count == 0:
                result.append([cur_start, i])
    return result
```

Rarely worth it in practice; the constant factors and the array allocation only pay off for tiny bounded ranges.

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

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_056_merge_intervals.py and run.
# Uses the canonical implementation (Approach 2).

def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    result = []
    for interval in intervals:
        if result and interval[0] <= result[-1][1]:
            result[-1][1] = max(result[-1][1], interval[1])
        else:
            result.append(list(interval))
    return result

def _run_tests():
    # Example 1 from problem statement
    assert merge([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]
    # Example 2: touching endpoints merge
    assert merge([[1,4],[4,5]]) == [[1,5]]
    # Single interval (edge case)
    assert merge([[1,2]]) == [[1,2]]
    # All overlap into one
    assert merge([[1,10],[2,5],[3,8]]) == [[1,10]]
    # Already non-overlapping
    assert merge([[1,2],[3,4],[5,6]]) == [[1,2],[3,4],[5,6]]
    # Unsorted input
    assert merge([[15,18],[1,3],[2,6],[8,10]]) == [[1,6],[8,10],[15,18]]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), sort + sweep
