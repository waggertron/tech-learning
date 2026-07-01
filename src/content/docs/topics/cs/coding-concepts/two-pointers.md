---
title: Two Pointers
description: "Two-index tactics for shrinking search space while preserving an invariant between positions."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Two pointers use two indices as moving boundaries. One pointer may start at each end, both may move in the same direction, or one may mark a write position while the other reads.

## Value

The value is pruning. Instead of trying every pair, the invariant tells you which side can be discarded without losing a valid answer.

## Challenges this solves

- sorted pair search
- palindrome and symmetry checks
- in-place compaction
- container or boundary optimization
- n-sum after sorting

## When to use it

Use it when the next move is implied by an ordering, symmetry, or boundary condition. A sorted array is the strongest signal.

## When not to use it

Do not use it when neither pointer movement discards a provably useless region. If moving either side is just a guess, the invariant is missing.

## Terminology clues

- sorted array
- pair
- palindrome
- from both ends
- in-place
- remove duplicates
- closest sum
- left and right

## Problems that use it

- [125. Valid Palindrome](../coding-problems/two-pointers/125-valid-palindrome/)
- [167. Two Sum II](../coding-problems/two-pointers/167-two-sum-ii/)
- [15. 3Sum](../coding-problems/two-pointers/015-3sum/)
- [11. Container With Most Water](../coding-problems/two-pointers/011-container-with-most-water/)

## Related concepts

- [Fast and slow pointers](./fast-and-slow-pointers/)
- [Sliding window](./sliding-window/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
