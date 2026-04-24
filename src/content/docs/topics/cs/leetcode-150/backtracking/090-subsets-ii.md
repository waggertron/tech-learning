---
title: "90. Subsets II"
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

Generate all 2ⁿ subsets via backtracking; canonicalize by sorting and dedupe with a set.

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
- **Time:** O(n · 2ⁿ) + set hashing.
- **Space:** O(n · 2ⁿ).

Works but wastes effort generating then filtering duplicates.

## Approach 2: Sort + skip duplicates at the same level (canonical)

Sort the array so duplicates sit together. At each recursion level, after taking `nums[i]`, skip any subsequent indices with the same value, they would produce the same subset at this level.

```python
def subsets_with_dup(nums):
    nums.sort()
    result = []
    path = []

    def backtrack(start):
        result.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i, 1]:
                continue   # skip duplicate at same level
            path.append(nums[i])
            backtrack(i + 1)
            path.pop()

    backtrack(0)
    return result
```

**Complexity**
- **Time:** O(n · 2ⁿ) in the worst case; significantly fewer visits when duplicates are present.
- **Space:** O(n) recursion.

### Why "at the same level"?
`i > start` means we've already considered one occurrence of this value at this recursion depth, taking a second one would produce a duplicate subset. But `i == start` is fine: that's a different level, where we *do* want to include the duplicate.

## Approach 3: Counter / multiset iteration

Count each distinct value; for each distinct value, choose to include it 0 to `count` times.

```python
from collections import Counter

def subsets_with_dup(nums):
    counts = Counter(nums)
    items = list(counts.items())
    result = []
    path = []

    def backtrack(i):
        if i == len(items):
            result.append(path[:])
            return
        val, cnt = items[i]
        # include j copies of val, j = 0..cnt
        for j in range(cnt + 1):
            for _ in range(j):
                path.append(val)
            backtrack(i + 1)
            for _ in range(j):
                path.pop()

    backtrack(0)
    return result
```

**Complexity**
- **Time:** Same asymptotic, often faster in practice with heavy duplicates.
- **Space:** O(n) recursion.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Generate + dedup | O(n · 2ⁿ) + hashing | O(n · 2ⁿ) |
| **Sort + skip same-level duplicates** | O(n · 2ⁿ) | O(n) |
| Counter / multiset | O(n · 2ⁿ) | O(n) |

The sort + skip template is the one to memorize, same pattern applies to Combination Sum II (40) and Permutations II (47).

## Related data structures

- [Arrays](../../../data-structures/arrays/), sorted for dedup at each level
- [Hash Tables](../../../data-structures/hash-tables/), optional Counter approach
