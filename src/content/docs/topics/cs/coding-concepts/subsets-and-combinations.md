---
title: Subsets and Combinations
description: "Choice-set tactics for generating selected groups while controlling duplicates and order."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Subsets and combinations use a start index and a current path. Each recursive step decides what candidate can be added next.

## Value

The value is avoiding duplicate work. A start index prevents reordering the same combination into multiple answers.

## Challenges this solves

- all subsets
- unique subsets with duplicates
- sum-to-target combinations
- choose k elements
- partition into groups

## When to use it

Use it when order in the output group does not matter and each group should appear once.

## When not to use it

Do not use combination logic for ordered arrangements. Permutation logic is different because positions matter.

## Terminology clues

- subset
- combination
- choose
- without regard to order
- unique groups
- sum target

## Problems that use it

- [78. Subsets](../coding-problems/backtracking/078-subsets/)
- [90. Subsets II](../coding-problems/backtracking/090-subsets-ii/)
- [39. Combination Sum](../coding-problems/backtracking/039-combination-sum/)
- [40. Combination Sum II](../coding-problems/backtracking/040-combination-sum-ii/)

## Related concepts

- [Backtracking](./backtracking/)
- [Permutations](./permutations/)
- [Bitmask state](./bitmask-state/)
