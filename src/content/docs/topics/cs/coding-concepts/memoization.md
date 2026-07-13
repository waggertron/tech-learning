---
title: Memoization
description: "Top-down caching tactics for preserving recursive clarity while avoiding repeated subproblem work."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Memoization is top-down dynamic programming. You write the natural recursive solution first, then cache the answer for each state so later calls return immediately.

The invariant is that a state is pure: the same state inputs always produce the same answer. If hidden mutable state changes the answer, the cache key is incomplete.

Memoization is often the fastest path from brute force to accepted DP. Keep the recursive meaning clear, choose a cache key, add base cases, and let the call graph visit only states that are actually reachable.

## Value

The value is preserving the shape of the search while eliminating repeated work. It is easier to derive than tabulation for many tree, graph, string, and interval DP problems.

### Direct complexity example

- **Brute force:** Recursive backtracking recomputes the same state through many paths: often $O(2^n)$ time.
- **With this tactic:** Cache each state after the first computation: $O(\text{states} \times \text{transition cost})$ time.
- **Space:** Space includes the cache plus recursion stack. The stack is usually $O(\text{depth})$ and the cache is $O(\text{states})$.

## Challenges this solves

- word break
- decode ways
- grid path counting
- interval DP
- recursive tree DP
- DFS with repeated states

## When to use it

Use this tactic when these conditions are true:

- the recursive solution is obvious but too slow
- subproblems repeat with the same parameters
- not every table state is reachable
- the dependency order is awkward to write bottom up

## When not to use it

Reach for a different tactic when these warning signs appear:

- the function depends on mutable global state not included in the key
- recursion depth exceeds language limits
- every state is required and tabulation would be simpler
- memory for the cache is larger than the input constraints allow

## Terminology clues

These prompt words often point toward this concept:

- cache
- top-down
- same state
- repeated calls
- DFS plus memo
- lru_cache
- overlapping
- state tuple

## Problems that use it

- [10. Regular Expression Matching](../../coding-problems/2d-dynamic-programming/010-regular-expression-matching/)
- [72. Edit Distance](../../coding-problems/2d-dynamic-programming/072-edit-distance/)
- [91. Decode Ways](../../coding-problems/1d-dynamic-programming/091-decode-ways/)
- [97. Interleaving String](../../coding-problems/2d-dynamic-programming/097-interleaving-string/)
- [139. Word Break](../../coding-problems/1d-dynamic-programming/139-word-break/)
- [494. Target Sum](../../coding-problems/2d-dynamic-programming/494-target-sum/)

## Related concepts

- [Dynamic programming](../dynamic-programming/)
- [Tabulation](../tabulation/)
- [Backtracking](../backtracking/)
