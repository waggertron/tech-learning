---
title: Bitmask State
description: "Compact-state tactics for representing chosen items, visited sets, and small DP dimensions as integer masks."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Bitmask state maps each small item or boolean flag to one bit. The integer mask becomes a compact key for recursion, DP, or subset generation.

## Value

The value is dense state storage. A set of booleans can be copied, compared, and cached as one integer.

## Challenges this solves

- subset enumeration
- visited choices
- small-N assignment
- state-compressed DP
- board occupancy

## When to use it

Use it when the number of tracked items is small enough to fit in an integer mask.

## When not to use it

Do not use it when item count is large or when readability matters more than compactness.

## Terminology clues

- subset mask
- visited set
- choose among n <= 20
- bitmask DP
- state compression

## Problems that use it

- [78. Subsets](../coding-problems/backtracking/078-subsets/)
- [51. N-Queens](../coding-problems/backtracking/051-n-queens/)
- [338. Counting Bits](../coding-problems/bit-manipulation/338-counting-bits/)
- [494. Target Sum](../coding-problems/2d-dynamic-programming/494-target-sum/)

## Related concepts

- [Bit manipulation](./bit-manipulation/)
- [State compression](./state-compression/)
- [Subsets and combinations](./subsets-and-combinations/)
