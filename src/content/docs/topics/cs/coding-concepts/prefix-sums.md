---
title: Prefix Sums
description: "Accumulation tactics for answering range-sum and subarray-count questions from differences between checkpoints."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Prefix sums store the total before each position. A range sum becomes the difference between two checkpoints, and a target subarray becomes a search for a previous checkpoint with the right value.

## Value

The value is turning range questions into constant-time arithmetic or hash lookups. This is the common bridge from nested subarray loops to linear time.

## Challenges this solves

- range sum queries
- counting subarrays with a target sum
- prefix and suffix products
- modulo remainder pairing
- balancing counts

## When to use it

Use it when a question asks about the sum, product, parity, or balance of a contiguous range.

## When not to use it

Do not use prefix sums when the range operation is not reversible. Minimum, maximum, and mode need different structures.

## Terminology clues

- subarray sum
- range sum
- between i and j
- prefix
- cumulative
- modulo
- divisible by

## Problems that use it

- [303. Range Sum Query Immutable](../coding-problems/arrays-and-hashing/303-range-sum-query-immutable/)
- [560. Subarray Sum Equals K](../coding-problems/sliding-window/560-subarray-sum-equals-k/)
- [238. Product of Array Except Self](../coding-problems/arrays-and-hashing/238-product-of-array-except-self/)
- [1010. Pairs of Songs Divisible by 60](../coding-problems/arrays-and-hashing/1010-pairs-of-songs-divisible-by-60/)

## Related concepts

- [Array scans](./array-scans/)
- [Hash map counting](./hash-map-counting/)
- [Difference arrays](./difference-arrays/)
