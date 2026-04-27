---
title: "1. Two Sum (Easy)"
description: Return indices of the two numbers in an array that add up to a target.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, arrays, hash-tables, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array of integers `nums` and an integer `target`, return **indices** of the two numbers such that they add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice. You can return the answer in any order.

**Example**
- `nums = [2, 7, 11, 15]`, `target = 9` → `[0, 1]`
- `nums = [3, 2, 4]`, `target = 6` → `[1, 2]`
- `nums = [3, 3]`, `target = 6` → `[0, 1]`

LeetCode 1 · [Link](https://leetcode.com/problems/two-sum/) · *Easy*

## Approach 1: Brute force, try every pair

Iterate all `(i, j)` pairs with `i < j`; return when `nums[i] + nums[j] == target`.

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    n = len(nums)                              # L1: O(1)
    for i in range(n):                         # L2: outer loop, n iterations
        for j in range(i + 1, n):             # L3: inner loop, up to n-i-1 iterations
            if nums[i] + nums[j] == target:    # L4: O(1) check
                return [i, j]                  # L5: O(1) return
    return []
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (len) | O(1) | 1 | O(1) |
| L2 (outer loop) | O(1) | n | O(n) |
| **L3, L4 (inner loop + check)** | **O(1)** | **up to n²/2** | **O(n²)** ← dominates |
| L5 (return) | O(1) | 1 | O(1) |

The nested loops make this quadratic. For `n = 10⁴`, that's ~50 million comparisons.

**Complexity**
- **Time:** O(n²), driven by L3/L4 (nested loops).
- **Space:** O(1).

## Approach 2: Sort with remembered indices + two pointers

Sort by value (keeping original indices), then use two pointers from both ends.

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    indexed = sorted(enumerate(nums), key=lambda p: p[1])  # L1: O(n log n)
    l, r = 0, len(indexed) - 1                             # L2: O(1)
    while l < r:                                            # L3: loop, at most n iterations
        s = indexed[l][1] + indexed[r][1]                  # L4: O(1) sum
        if s == target:                                     # L5: O(1) check
            return sorted([indexed[l][0], indexed[r][0]])  # L6: O(1) (2-element sort)
        if s < target:                                      # L7: O(1)
            l += 1                                          # L8: O(1)
        else:
            r -= 1                                          # L9: O(1)
    return []
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (sort)** | **O(n log n)** | **1** | **O(n log n)** ← dominates |
| L2 (init pointers) | O(1) | 1 | O(1) |
| L3-L9 (two-pointer scan) | O(1) | at most n | O(n) |

The sort owns the total cost; the two-pointer scan is linear.

**Complexity**
- **Time:** O(n log n), driven by L1 (the sort).
- **Space:** O(n), the indexed copy.

This is the right approach for LeetCode **167. Two Sum II** (input already sorted), where it drops to O(n) time and O(1) space.

## Approach 3: Hash map in a single pass (optimal)

For each element `x`, look up its complement `target - x` in a hash map of elements seen so far. If it's there, we've found the pair.

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}                          # L1: O(1), empty dict
    for i, x in enumerate(nums):      # L2: loop, n iterations
        complement = target - x        # L3: O(1) arithmetic
        if complement in seen:         # L4: O(1) average hash lookup
            return [seen[complement], i]  # L5: O(1) return
        seen[x] = i                    # L6: O(1) average hash insert
    return []
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init dict) | O(1) | 1 | O(1) |
| L2 (loop) | O(1) | n | O(n) |
| L3 (arithmetic) | O(1) | n | O(n) |
| **L4 (hash lookup)** | **O(1) avg** | **n** | **O(n)** ← dominates |
| L5 (return) | O(1) | 1 | O(1) |
| L6 (hash insert) | O(1) avg | up to n | O(n) |

Every operation is O(1) average per iteration. One pass over n elements gives O(n) total.

**Complexity**
- **Time:** O(n), driven by L4/L6 (hash operations per element).
- **Space:** O(n). Hash map can hold up to `n` entries.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n²) | O(1) |
| Sort + two pointers | O(n log n) | O(n) |
| **Hash map** | **O(n)** | O(n) |

The hash-map approach is the canonical answer. It's strictly better than sort on time and same on space. The sort variant is worth knowing because it generalizes to Two Sum II (sorted) and 3Sum.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_two_sum.py and run.
# Uses the canonical implementation (Approach 3: hash map).

def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, x in enumerate(nums):
        complement = target - x
        if complement in seen:
            return [seen[complement], i]
        seen[x] = i
    return []

def _run_tests():
    assert two_sum([2, 7, 11, 15], 9) == [0, 1]
    assert two_sum([3, 2, 4], 6) == [1, 2]
    assert two_sum([3, 3], 6) == [0, 1]
    assert two_sum([1, 2, 3, 4, 5], 9) == [3, 4]
    # Single-pair array
    assert two_sum([0, 4], 4) == [0, 1]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), input; two-pointer pattern on the sorted variant
- [Hash Tables](../../../data-structures/hash-tables/), complement-lookup (the optimal pattern)
