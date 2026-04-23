---
title: "128. Longest Consecutive Sequence"
description: Find the length of the longest run of consecutive integers in an unsorted array — in O(n) time.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, arrays, hash-tables, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an unsorted array of integers `nums`, return the length of the longest consecutive-integer sequence. The algorithm must run in **O(n)** time.

**Example**
- `nums = [100, 4, 200, 1, 3, 2]` → `4` (the sequence `[1, 2, 3, 4]`)
- `nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]` → `9`

LeetCode 128 · [Link](https://leetcode.com/problems/longest-consecutive-sequence/) · *Medium*

## Approach 1: Brute force — for each number, walk forward

For each number `x`, linearly scan the array for `x+1`, `x+2`, … until a miss.

```python
def longest_consecutive(nums: list[int]) -> int:
    best = 0
    for x in nums:
        cur = x
        length = 1
        while cur + 1 in nums:   # O(n) membership on a list
            cur += 1
            length += 1
        best = max(best, length)
    return best
```

**Complexity**
- **Time:** O(n³) in the worst case. `cur + 1 in nums` is O(n) on a list, called up to n times per outer iteration.
- **Space:** O(1) extra.

Clearly doesn't meet the O(n) requirement — useful to see what the naive instinct would cost.

## Approach 2: Sort, then count runs

After sorting, runs of consecutive integers are adjacent. Walk the sorted array.

```python
def longest_consecutive(nums: list[int]) -> int:
    if not nums:
        return 0
    nums_sorted = sorted(set(nums))   # de-dup first
    best = cur = 1
    for i in range(1, len(nums_sorted)):
        if nums_sorted[i] == nums_sorted[i - 1] + 1:
            cur += 1
            best = max(best, cur)
        else:
            cur = 1
    return best
```

**Complexity**
- **Time:** O(n log n). Dominated by the sort.
- **Space:** O(n) for the sorted set.

Correct and simple, but violates the explicit O(n) constraint in the prompt.

## Approach 3: Hash set + run-start detection (optimal)

Put everything in a set. For each number, only start counting a run if `x - 1` is *not* in the set (so `x` is a run start). Then walk upward as long as the next integer is present.

Each element is touched by a walking pointer at most once across the whole algorithm → total O(n).

```python
def longest_consecutive(nums: list[int]) -> int:
    num_set = set(nums)
    best = 0
    for x in num_set:
        if x - 1 in num_set:       # not a run start
            continue
        cur = x
        length = 1
        while cur + 1 in num_set:
            cur += 1
            length += 1
        best = max(best, length)
    return best
```

**Complexity**
- **Time:** O(n). The `x - 1 in num_set` guard means each run is walked from its start exactly once; the inner `while` loops run n times in total across the whole outer loop.
- **Space:** O(n) for the set.

### Alternative: Union-Find
A second O(n) approach unions every `x` with `x - 1` and `x + 1` in a disjoint-set structure and returns the largest component size. Same asymptotics, more code — worth knowing for the pattern.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| For-each + linear search | O(n³) | O(1) |
| Sort + count | O(n log n) | O(n) |
| **Hash set + run start** | **O(n)** | O(n) |

The run-start trick is elegant and exact-fit to the problem's constraint. Recognize "I need O(n) but I also need order" as the signal to reach for a hash set with an invariant.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — input
- [Hash Tables](../../../data-structures/hash-tables/) — set membership for O(1) lookups; run-start detection
