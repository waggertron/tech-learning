---
title: "39. Combination Sum"
description: Find all unique combinations from a candidate set that sum to a target (unlimited reuse of each candidate).
parent: backtracking
tags: [leetcode, neetcode-150, backtracking, recursion, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array of **distinct** positive integers `candidates` and a target integer, return all unique combinations where the chosen numbers sum to `target`. You may use each candidate unlimited times. Combinations are unique if the multiset of numbers chosen is unique; order doesn't matter.

**Example**
- `candidates = [2,3,6,7]`, `target = 7` → `[[2,2,3], [7]]`
- `candidates = [2,3,5]`, `target = 8` → `[[2,2,2,2], [2,3,3], [3,5]]`

LeetCode 39 · [Link](https://leetcode.com/problems/combination-sum/) · *Medium*

## Approach 1: Brute force, try all orderings, dedup

Recurse over every candidate (any number of times), deduplicate at the end by sorting each combination into a canonical form.

```python
def combination_sum(candidates, target):
    found = set()
    def rec(remaining, path):
        if remaining == 0:
            found.add(tuple(sorted(path)))
            return
        if remaining < 0:
            return
        for c in candidates:
            path.append(c)
            rec(remaining, c, path)
            path.pop()
    rec(target, [])
    return [list(t) for t in found]
```

**Complexity**
- **Time:** Exponential, every ordered sequence is explored, then collapsed.
- **Space:** Same.

Wasteful; every combination is re-found under every permutation.

## Approach 2: Backtracking with `start` index (canonical)

Enforce an ordering: once you "use" index `i`, later recursive calls can only consider indices `≥ i`. This guarantees each combination is built in sorted candidate order exactly once.

Because we can reuse the same candidate, we pass `i` (not `i + 1`) when recursing after including.

```python
def combination_sum(candidates, target):
    result = []
    path = []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        if remaining < 0:
            return
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            backtrack(i, remaining, candidates[i])   # note: i, not i + 1
            path.pop()

    backtrack(0, target)
    return result
```

**Complexity**
- **Time:** Exponential in the depth of the search tree. Bounded by O(n^(target / min(candidates))).
- **Space:** O(target / min(candidates)) recursion.

## Approach 3: Sort + early termination (optimization)

Sort candidates ascending. When iterating, break the loop as soon as `candidates[i] > remaining`, every subsequent candidate is too large.

```python
def combination_sum(candidates, target):
    candidates.sort()
    result = []
    path = []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break    # sorted: all remaining are too large
            path.append(candidates[i])
            backtrack(i, remaining, candidates[i])
            path.pop()

    backtrack(0, target)
    return result
```

**Complexity**
- **Time:** Same worst-case Big-O; practical speedup from pruning is substantial on inputs with mixed sizes.
- **Space:** O(target / min(candidates)).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| All orderings + dedup | huge | huge |
| **Backtracking with `start`** | O(n^(target/min)) | O(target/min) |
| **Sort + prune** | same Big-O, faster in practice | same |

The `start` index is the critical idea, same template solves Combination Sum II (40) and Subsets II (90) with a small tweak for duplicates.

## Related data structures

- [Arrays](../../../data-structures/arrays/), candidate list; sorted for pruning
