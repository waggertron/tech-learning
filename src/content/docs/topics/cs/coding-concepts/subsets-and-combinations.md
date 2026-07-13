---
title: Subsets and Combinations
description: "Choice-set tactics for generating selected groups while controlling duplicates and order."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Subsets and combinations generate selected groups where order of selection does not define a new answer. The same values chosen in a different order should not appear twice.

The invariant is an increasing choice boundary. Each recursive call receives a start index, and future choices come from that index onward. That prevents reordering the same group into duplicates.

Duplicate input values need special care. Sorting plus skipping equal values at the same recursion depth keeps one representative branch while preserving valid duplicates across different depths.

## Value

The value is making the search tree match the output definition. You avoid producing permutations when the problem only wants combinations.

### Direct complexity example

- **Brute force:** Generate all permutations and deduplicate groups afterward: up to $O(n!)$ time plus large set storage.
- **With this tactic:** Generate each subset or combination shape directly: $O(2^n)$ for all subsets or $O(\binom{n}{k} \cdot k)$ for size `k` combinations.
- **Space:** Space is $O(n)$ recursion depth plus output. Duplicate-control sets may add memory if sorting is not used.

## Challenges this solves

- subsets
- combination sum
- choose k items
- unique combinations
- partition choices

## When to use it

Use this tactic when these conditions are true:

- order does not matter in the answer
- the problem asks for groups, sets, or combinations
- a start index can prevent reuse of earlier choices
- duplicates can be controlled by sorting

## When not to use it

Reach for a different tactic when these warning signs appear:

- different orders are distinct answers
- the problem asks for the next lexicographic arrangement
- the choice count is too large and only a count is needed, which may point to DP or math
- constraints require pruning by cost or validity beyond simple grouping

## Terminology clues

These prompt words often point toward this concept:

- subset
- combination
- choose
- group
- order does not matter
- unique
- without duplicates
- k elements

## Problems that use it

- [39. Combination Sum](../../coding-problems/backtracking/039-combination-sum/)
- [40. Combination Sum II](../../coding-problems/backtracking/040-combination-sum-ii/)
- [78. Subsets](../../coding-problems/backtracking/078-subsets/)
- [90. Subsets II](../../coding-problems/backtracking/090-subsets-ii/)

## Related concepts

- [Backtracking](../backtracking/)
- [Permutations](../permutations/)
- [Bitmask state](../bitmask-state/)
