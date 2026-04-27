---
title: "167. Two Sum II, Input Array Is Sorted"
description: Given a 1-indexed sorted array, return indices of the two numbers that sum to the target.
parent: two-pointers
tags: [leetcode, neetcode-150, arrays, two-pointers, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a **1-indexed** array `numbers` that is already sorted in non-decreasing order, find two numbers such that they sum to `target`. Return `[index1, index2]` where `index1 < index2`. Exactly one solution exists, and you may not use the same element twice.

Constraint: **must use only constant extra space**.

**Example**
- `numbers = [2, 7, 11, 15]`, `target = 9` → `[1, 2]`
- `numbers = [2, 3, 4]`, `target = 6` → `[1, 3]`

LeetCode 167 · [Link](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) · *Medium*

## Approach 1: Brute force, try every pair

```python
def two_sum(numbers: list[int], target: int) -> list[int]:
    n = len(numbers)                                    # L1: O(1)
    for i in range(n):                                  # L2: outer loop, n iterations
        for j in range(i + 1, n):                       # L3: inner loop
            if numbers[i] + numbers[j] == target:       # L4: O(1) check
                return [i + 1, j + 1]                   # L5: O(1) return (1-indexed)
    return []
```

**Where the time goes, line by line**

*Variables: n = len(numbers).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (outer loop) | O(1) | n | O(n) |
| **L3, L4 (inner loop + check)** | **O(1)** | **~n²/2** | **O(n²)** ← dominates |
| L5 (return) | O(1) | 1 | O(1) |

**Complexity**
- **Time:** O(n²), driven by L3/L4 (nested loops).
- **Space:** O(1).

Ignores that the array is sorted, so this is strictly worse than it needs to be.

## Approach 2: For each element, binary search for the complement

Since the array is sorted, you can binary-search for `target - numbers[i]` in the suffix.

```python
from bisect import bisect_left

def two_sum(numbers: list[int], target: int) -> list[int]:
    n = len(numbers)                                    # L1: O(1)
    for i in range(n):                                  # L2: outer loop, n iterations
        need = target - numbers[i]                      # L3: O(1) complement
        j = bisect_left(numbers, need, i + 1, n)        # L4: O(log n) binary search
        if j < n and numbers[j] == need:                # L5: O(1) verify
            return [i + 1, j + 1]                       # L6: O(1) return
    return []
```

**Where the time goes, line by line**

*Variables: n = len(numbers).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (outer loop) | O(1) | n | O(n) |
| **L4 (binary search)** | **O(log n)** | **n** | **O(n log n)** ← dominates |
| L3, L5, L6 | O(1) | n | O(n) |

**Complexity**
- **Time:** O(n log n), driven by L4 (n iterations × O(log n) binary search).
- **Space:** O(1).

Uses the sort structure, but not optimally.

## Approach 3: Two pointers from both ends (optimal)

Start with pointers at both ends. If the sum is too small, move the left pointer right (increase sum). If too large, move the right pointer left (decrease sum). This works exactly because the array is sorted.

```python
def two_sum(numbers: list[int], target: int) -> list[int]:
    l, r = 0, len(numbers) - 1           # L1: O(1) init pointers
    while l < r:                          # L2: at most n iterations
        s = numbers[l] + numbers[r]       # L3: O(1) sum
        if s == target:                   # L4: O(1) check
            return [l + 1, r + 1]         # L5: O(1) return (1-indexed)
        if s < target:                    # L6: O(1)
            l += 1                        # L7: O(1) advance left
        else:
            r -= 1                        # L8: O(1) advance right
    return []
```

**Where the time goes, line by line**

*Variables: n = len(numbers).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| L2 (loop condition) | O(1) | n | O(n) |
| **L3-L8 (sum + advance)** | **O(1)** | **n** | **O(n)** ← dominates |

Each iteration advances either `l` or `r` by one; they start n-1 apart and meet, so at most n-1 iterations.

**Complexity**
- **Time:** O(n), driven by L3-L8 (one sum and pointer step per iteration). Each pointer moves in one direction only, so total work is linear.
- **Space:** O(1).

### Why it's correct

At any point, `numbers[l] + numbers[r]` is the sum under consideration. If it's too small, `numbers[l]` can't be part of any valid pair with *any* remaining right value, moving `l` right is safe. Symmetric argument for moving `r` left. So the pair, if it exists, must be found during the walk.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n²) | O(1) |
| Per-element binary search | O(n log n) | O(1) |
| **Two pointers** | **O(n)** | **O(1)** |

The two-pointer approach is the standard answer. Generalizes directly to 3Sum and 4Sum.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_two_sum_ii.py and run.
# Uses the canonical implementation (Approach 3: two pointers).

def two_sum(numbers: list[int], target: int) -> list[int]:
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:
            return [l + 1, r + 1]
        if s < target:
            l += 1
        else:
            r -= 1
    return []

def _run_tests():
    assert two_sum([2, 7, 11, 15], 9) == [1, 2]
    assert two_sum([2, 3, 4], 6) == [1, 3]
    assert two_sum([3, 3], 6) == [1, 2]
    assert two_sum([1, 2, 3, 4, 5], 9) == [4, 5]
    assert two_sum([-3, -1, 0, 2, 4], 1) == [1, 5]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), sorted-array access is the precondition for two pointers
