---
title: "46. Permutations"
description: Return all permutations of an array of distinct integers.
parent: backtracking
tags: [leetcode, neetcode-150, backtracking, recursion, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array `nums` of **distinct** integers, return all possible permutations. You may return them in any order.

**Example**
- `nums = [1, 2, 3]` → `[[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]`
- `nums = [0, 1]` → `[[0, 1], [1, 0]]`

LeetCode 46 · [Link](https://leetcode.com/problems/permutations/) · *Medium*

## Approach 1: Brute force — `itertools.permutations`

Python's standard library does this directly.

```python
from itertools import permutations

def permute(nums):
    return [list(p) for p in permutations(nums)]
```

**Complexity**
- **Time:** O(n · n!).
- **Space:** O(n · n!) output.

Production-correct; usually rejected in interviews that want the algorithm.

## Approach 2: Backtracking with a `used` array

Track which indices have been consumed; at each recursion, try every unused index.

```python
def permute(nums):
    result = []
    n = len(nums)
    used = [False] * n
    path = []

    def backtrack():
        if len(path) == n:
            result.append(path[:])
            return
        for i in range(n):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack()
            path.pop()
            used[i] = False

    backtrack()
    return result
```

**Complexity**
- **Time:** O(n · n!).
- **Space:** O(n) recursion + output.

The clearest expression of the backtracking template for permutations.

## Approach 3: In-place swap (no auxiliary `used`)

Swap the current position with every other position; recurse on the tail. Undo the swap on the way back up.

```python
def permute(nums):
    result = []

    def backtrack(start):
        if start == len(nums):
            result.append(nums[:])
            return
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]

    backtrack(0)
    return result
```

**Complexity**
- **Time:** O(n · n!).
- **Space:** O(n) recursion.

Saves the `used` array. Slightly less readable; mutates input.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| `itertools.permutations` | O(n · n!) | O(n · n!) |
| **Backtracking + `used`** | **O(n · n!)** | **O(n)** recursion |
| In-place swap | O(n · n!) | O(n) recursion |

All three are optimal in Big-O (output is itself Θ(n · n!)). Backtracking with `used` is the cleanest template; extends directly to Permutations II (duplicates allowed).

## Related data structures

- [Arrays](../../../data-structures/arrays/) — input; `used` marker array
