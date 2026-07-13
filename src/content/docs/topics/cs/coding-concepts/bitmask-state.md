---
title: Bitmask State
description: "Compact-state tactics for representing chosen items, visited sets, and small DP dimensions as integer masks."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Bitmask state represents a small set as bits inside an integer. Bit `i` answers whether item `i` is chosen, visited, or available.

The invariant is set membership encoded compactly. Adding an item sets a bit, removing clears a bit, and testing membership checks one bit.

This tactic is useful when the number of items is small enough for `2^n` states. It often appears in DP where a normal set would be too heavy as a key.

## Value

The value is making subset state cheap to store, compare, and transition. It turns complex set keys into integers.

### Direct complexity example

- **Brute force:** Use explicit sets or tuples as DP keys for every subset: $O(2^n \cdot n)$ states with high hashing and memory overhead.
- **With this tactic:** Use integer masks and bit operations: same asymptotic state count, but much smaller constants and often $O(1)$ membership checks.
- **Space:** Space is still $O(2^n)$ when storing every subset state. The saving is representation size, not the exponential state count.

## Challenges this solves

- visited set in small graph DP
- assignment problems
- subsets DP
- word masks
- N-Queens diagonals
- state compression for chosen items

## When to use it

Use this tactic when these conditions are true:

- n is small, often 20 or less
- a state is a subset of items
- membership and add/remove operations are frequent
- the DP key would otherwise contain a set

## When not to use it

Reach for a different tactic when these warning signs appear:

- the number of items is too large for `2^n`
- items do not map cleanly to bit positions
- the language integer width is limiting
- the state needs counts greater than one per item

## Terminology clues

These prompt words often point toward this concept:

- mask
- bitmask
- visited set
- subset state
- chosen items
- 2^n
- toggle
- set bit

## Problems that use it

- [51. N-Queens](../../coding-problems/backtracking/051-n-queens/)
- [78. Subsets](../../coding-problems/backtracking/078-subsets/)
- [338. Counting Bits](../../coding-problems/bit-manipulation/338-counting-bits/)
- [494. Target Sum](../../coding-problems/2d-dynamic-programming/494-target-sum/)

## Related concepts

- [Bit manipulation](../bit-manipulation/)
- [State compression](../state-compression/)
- [Subsets and combinations](../subsets-and-combinations/)
