---
title: "46. Permutations (Medium)"
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

## Approach 1: Brute force, `itertools.permutations`

Python's standard library does this directly.

```python
from itertools import permutations

def permute(nums):
    return [list(p) for p in permutations(nums)]  # L1: O(n · n!) total output
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (generate + convert)** | **O(n) per permutation** | **n!** | **O(n · n!)** ← dominates |

**Complexity**
- **Time:** O(n · n!), driven by L1 generating and copying n! permutations each of length n.
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
            result.append(path[:])      # L1: O(n) copy at leaf
            return
        for i in range(n):
            if used[i]:
                continue                # L2: O(1) skip used
            used[i] = True             # L3: O(1) mark used
            path.append(nums[i])        # L4: O(1) push
            backtrack()                 # L5: recurse
            path.pop()                 # L6: O(1) pop
            used[i] = False            # L7: O(1) unmark

    backtrack()
    return result
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (copy) | O(n) | n! | O(n · n!) |
| L2 (skip) | O(1) | n per level | O(n · n!) |
| **L5 (recurse)** | **O(1) dispatch** | **n · n! nodes** | **O(n · n!)** ← dominates (all lines tie) |

The recursion tree has n! leaves, each at depth n, giving O(n · n!) total node visits.

**Complexity**
- **Time:** O(n · n!), driven by L5 traversing the full permutation tree.
- **Space:** O(n) recursion + output.

The clearest expression of the backtracking template for permutations.

## Approach 3: In-place swap (no auxiliary `used`)

Swap the current position with every other position; recurse on the tail. Undo the swap on the way back up.

```python
def permute(nums):
    result = []

    def backtrack(start):
        if start == len(nums):
            result.append(nums[:])          # L1: O(n) copy
            return
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]   # L2: O(1) swap
            backtrack(start + 1)                          # L3: recurse
            nums[start], nums[i] = nums[i], nums[start]   # L4: O(1) undo swap

    backtrack(0)
    return result
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (copy) | O(n) | n! | O(n · n!) |
| L2/L4 (swap + undo) | O(1) | n · n! | O(n · n!) |
| **L3 (recurse)** | **O(1) dispatch** | **n · n! nodes** | **O(n · n!)** ← dominates (all lines tie) |

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

All three are optimal in Big-O (output is itself O(n · n!)). Backtracking with `used` is the cleanest template; extends directly to Permutations II (duplicates allowed).

## Test cases

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
            if used[i]: continue
            used[i] = True
            path.append(nums[i])
            backtrack()
            path.pop()
            used[i] = False
    backtrack()
    return result

def _run_tests():
    r = permute([1, 2, 3])
    assert len(r) == 6
    assert sorted(map(tuple, r)) == sorted([
        (1,2,3),(1,3,2),(2,1,3),(2,3,1),(3,1,2),(3,2,1)])
    r2 = permute([0, 1])
    assert sorted(map(tuple, r2)) == [(0,1),(1,0)]
    # single element
    assert permute([1]) == [[1]]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), input; `used` marker array
