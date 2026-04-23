---
title: "78. Subsets"
description: Return all possible subsets of a set of distinct integers.
parent: backtracking
tags: [leetcode, neetcode-150, backtracking, recursion, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums` of **distinct** elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets; order doesn't matter.

**Example**
- `nums = [1, 2, 3]` → `[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]`
- `nums = [0]` → `[[], [0]]`

LeetCode 78 · [Link](https://leetcode.com/problems/subsets/) · *Medium*

## Approach 1: Bitmask enumeration

There are 2ⁿ subsets; enumerate them by treating `i ∈ [0, 2ⁿ)` as a bitmask over the input.

```python
def subsets(nums):
    n = len(nums)
    result = []
    for mask in range(1 << n):
        subset = [nums[i] for i in range(n) if mask & (1 << i)]
        result.append(subset)
    return result
```

**Complexity**
- **Time:** O(n · 2ⁿ).
- **Space:** O(n · 2ⁿ) output.

Simple and fast for small n. Struggles past n ≈ 20.

## Approach 2: Iterative build (grow by appending each element)

Start with `[[]]`; for each element, duplicate every existing subset and add the element to the duplicates.

```python
def subsets(nums):
    result = [[]]
    for x in nums:
        result += [s + [x] for s in result]
    return result
```

**Complexity**
- **Time:** O(n · 2ⁿ).
- **Space:** O(n · 2ⁿ).

Elegant, especially in Python. Slightly more allocation than the backtracking version.

## Approach 3: Backtracking with include/exclude (canonical)

At each index, choose to include or exclude the current element. Record the path at every recursive call (it's already a valid subset).

```python
def subsets(nums):
    result = []
    path = []

    def backtrack(i):
        if i == len(nums):
            result.append(path[:])
            return
        # exclude
        backtrack(i + 1)
        # include
        path.append(nums[i])
        backtrack(i + 1)
        path.pop()

    backtrack(0)
    return result
```

**Complexity**
- **Time:** O(n · 2ⁿ).
- **Space:** O(n) recursion + output.

### Why `path[:]`?
We mutate `path` in place across recursive calls. When we record a subset, we need a snapshot — hence the copy.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Bitmask | O(n · 2ⁿ) | O(n · 2ⁿ) |
| Iterative build | O(n · 2ⁿ) | O(n · 2ⁿ) |
| **Backtracking** | **O(n · 2ⁿ)** | **O(n · 2ⁿ)** |

All three have the same asymptotic complexity (the output itself is Θ(n · 2ⁿ)). The backtracking template is the one that generalizes to Subsets II (with duplicates) and other tree-of-choices problems.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — input; enumeration
