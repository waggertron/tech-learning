---
title: "40. Combination Sum II"
description: Find all unique combinations where each candidate is used at most once and the sum equals the target.
parent: backtracking
tags: [leetcode, neetcode-150, backtracking, recursion, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a collection of integers `candidates` (may contain duplicates) and a target, find all unique combinations that sum to `target`. Each number may be used **at most once**; the result must not contain duplicate combinations.

**Example**
- `candidates = [10,1,2,7,6,1,5]`, `target = 8` → `[[1,1,6], [1,2,5], [1,7], [2,6]]`
- `candidates = [2,5,2,1,2]`, `target = 5` → `[[1,2,2], [5]]`

LeetCode 40 · [Link](https://leetcode.com/problems/combination-sum-ii/) · *Medium*

## Approach 1: Brute force — all subsets, filter by sum, dedup

Generate the power set; keep subsets summing to target; dedup via canonical tuples.

```python
def combination_sum2(candidates, target):
    from itertools import chain, combinations
    found = set()
    for r in range(1, len(candidates) + 1):
        for combo in combinations(candidates, r):
            if sum(combo) == target:
                found.add(tuple(sorted(combo)))
    return [list(t) for t in found]
```

**Complexity**
- **Time:** O(2ⁿ · n log n).
- **Space:** same.

Exponential and wasteful.

## Approach 2: Backtracking with `start` index (no skip)

Standard `start`-based backtracking — but without duplicate handling, this produces duplicate combinations when the input has repeated values.

```python
def combination_sum2(candidates, target):
    candidates.sort()
    result = []
    path = []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break
            path.append(candidates[i])
            backtrack(i + 1, remaining - candidates[i])
            path.pop()

    backtrack(0, target)
    # Dedup the output
    return list({tuple(x) for x in result})  # fix
```

**Complexity**
- **Time:** exponential + O(m log m) for dedup.
- **Space:** exponential storage.

The dedup step is a symptom — fix it at the source.

## Approach 3: Sort + skip same-level duplicates (canonical)

Sort, then at each level skip indices whose value equals the previous one *at the same level*. Same template as Subsets II.

```python
def combination_sum2(candidates, target):
    candidates.sort()
    result = []
    path = []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break   # pruning
            if i > start and candidates[i] == candidates[i - 1]:
                continue   # skip duplicate at this level
            path.append(candidates[i])
            backtrack(i + 1, remaining - candidates[i])   # i + 1 because no reuse
            path.pop()

    backtrack(0, target)
    return result
```

**Complexity**
- **Time:** O(2ⁿ) worst case; pruning and skip make it much faster in practice.
- **Space:** O(target) recursion.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Powerset + filter + dedup | O(2ⁿ · n log n) | O(2ⁿ) |
| Backtracking + post-dedup | exponential | exponential |
| **Sort + skip same-level** | O(2ⁿ) with pruning | O(target) |

The skip-same-level template (shared with Subsets II) is the right abstraction for "no duplicates allowed when input has duplicates."

## Related data structures

- [Arrays](../../../data-structures/arrays/) — sorted for pruning and dedup
