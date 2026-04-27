---
title: "90. Subsets II (Medium)"
description: Return all unique subsets of an integer array that may contain duplicates.
parent: backtracking
tags: [leetcode, neetcode-150, backtracking, recursion, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums` (may contain duplicates), return all possible subsets. The result must not contain duplicate subsets.

**Example**
- `nums = [1, 2, 2]` → `[[], [1], [2], [1,2], [2,2], [1,2,2]]`
- `nums = [0]` → `[[], [0]]`

LeetCode 90 · [Link](https://leetcode.com/problems/subsets-ii/) · *Medium*

## Approach 1: Subsets with set-dedup

Generate all 2^n subsets via backtracking; canonicalize by sorting and dedupe with a set.

```python
def subsets_with_dup(nums):
    nums.sort()
    found = set()
    result = []

    def backtrack(i, path):
        if i == len(nums):
            key = tuple(path)
            if key not in found:
                found.add(key)
                result.append(list(path))
            return
        backtrack(i + 1, path)
        path.append(nums[i])
        backtrack(i + 1, path)
        path.pop()

    backtrack(0, [])
    return result
```

**Complexity**
- **Time:** O(n · 2^n) + set hashing.
- **Space:** O(n · 2^n).

Works but wastes effort generating then filtering duplicates.

## Approach 2: Sort + skip duplicates at the same level (canonical)

Sort the array so duplicates sit together. At each recursion level, after taking `nums[i]`, skip any subsequent indices with the same value, they would produce the same subset at this level.

```python
def subsets_with_dup(nums):
    nums.sort()                               # L1: O(n log n) sort
    result = []
    path = []

    def backtrack(start):
        result.append(path[:])                # L2: O(k) copy at every node (not just leaves)
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue                      # L3: O(1) skip same-level duplicate
            path.append(nums[i])              # L4: O(1) push
            backtrack(i + 1)                  # L5: recurse
            path.pop()                        # L6: O(1) pop

    backtrack(0)
    return result
```

**Where the time goes, line by line**

*Variables: n = len(nums), k = average subset length.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (sort) | O(n log n) | 1 | O(n log n) |
| **L2 (copy)** | **O(k)** | **2^n nodes** | **O(n · 2^n)** ← dominates |
| L3 (skip dup) | O(1) | dup nodes | O(dup) |
| L5 (recurse) | O(1) dispatch | 2^n | O(2^n) |

Every node in the recursion tree emits a result (unlike Combination Sum where only leaves do). The duplicate skip at L3 keeps the tree to 2^(distinct elements) nodes, eliminating redundant branches.

**Complexity**
- **Time:** O(n · 2^n) in the worst case; significantly fewer visits when duplicates are present, driven by L2/L5.
- **Space:** O(n) recursion.

### Why "at the same level"?
`i > start` means we've already considered one occurrence of this value at this recursion depth, taking a second one would produce a duplicate subset. But `i == start` is fine: that's a different level, where we *do* want to include the duplicate.

## Approach 3: Counter / multiset iteration

Count each distinct value; for each distinct value, choose to include it 0 to `count` times.

```python
from collections import Counter

def subsets_with_dup(nums):
    counts = Counter(nums)                    # L1: O(n) count
    items = list(counts.items())
    result = []
    path = []

    def backtrack(i):
        if i == len(items):
            result.append(path[:])            # L2: O(k) copy at leaf
            return
        val, cnt = items[i]
        for j in range(cnt + 1):             # L3: choose 0..cnt copies
            for _ in range(j):
                path.append(val)
            backtrack(i + 1)                  # L4: recurse
            for _ in range(j):
                path.pop()

    backtrack(0)
    return result
```

**Where the time goes, line by line**

*Variables: n = len(nums), d = number of distinct values.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (count) | O(n) | 1 | O(n) |
| L3 (inner loop) | O(cnt) | d levels | O(n) |
| **L4 (recurse)** | **O(1) dispatch** | **product(cnt+1)** | **O(2^n)** ← dominates |

**Complexity**
- **Time:** Same asymptotic, often faster in practice with heavy duplicates.
- **Space:** O(n) recursion.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Generate + dedup | O(n · 2^n) + hashing | O(n · 2^n) |
| **Sort + skip same-level duplicates** | O(n · 2^n) | O(n) |
| Counter / multiset | O(n · 2^n) | O(n) |

The sort + skip template is the one to memorize, same pattern applies to Combination Sum II (40) and Permutations II (47).

## Test cases

```python
def subsets_with_dup(nums):
    nums.sort(); result = []; path = []
    def backtrack(start):
        result.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]: continue
            path.append(nums[i]); backtrack(i + 1); path.pop()
    backtrack(0)
    return result

def _run_tests():
    r = subsets_with_dup([1, 2, 2])
    assert sorted(map(tuple, r)) == sorted([(), (1,), (2,), (1,2), (2,2), (1,2,2)])
    r2 = subsets_with_dup([0])
    assert sorted(map(tuple, r2)) == [(), (0,)]
    # all same elements: [2,2,2] -> [], [2], [2,2], [2,2,2]
    r3 = subsets_with_dup([2, 2, 2])
    assert sorted(map(tuple, r3)) == sorted([(), (2,), (2,2), (2,2,2)])
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), sorted for dedup at each level
- [Hash Tables](../../../data-structures/hash-tables/), optional Counter approach
