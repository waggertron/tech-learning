---
title: Prefix Sums
description: "Accumulation tactics for answering range-sum and subarray-count questions from differences between checkpoints."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Prefix sums store cumulative totals at checkpoints. A range sum becomes the difference between two checkpoints instead of a fresh loop over the range.

The invariant is that `prefix[i]` summarizes every element before index `i`. Once that invariant is true, `sum(l..r)` is `prefix[r + 1] - prefix[l]`. Counting problems use the same idea with earlier prefix values stored in a map.

The trick is choosing the right checkpoint. For exact range queries, store every prefix. For subarray counts, store how many times each previous prefix value occurred. For two-dimensional grids, store row and column checkpoints so rectangles can be recovered by inclusion and exclusion.

## Value

The value is precomputation. Prefix sums pay one linear pass so each later range query or subarray comparison becomes constant time or a hash lookup.

### Direct complexity example

- **Brute force:** Answer `q` range-sum queries by scanning each range: $O(qn)$ worst-case time and $O(1)$ space.
- **With this tactic:** Build prefix sums once and answer each query by subtraction: $O(n + q)$ time and $O(n)$ space.
- **Space:** For subarray counts, the frequency map of prefix values can also use $O(n)$ space.

## Challenges this solves

- range sum queries
- subarray sum equals target
- balance between counts
- 2D rectangle sums
- turning products or counts into accumulated checkpoints

## When to use it

Use this tactic when these conditions are true:

- the problem repeatedly asks about sums over ranges
- a subarray condition can be expressed as `prefix[j] - prefix[i]`
- the input is static while queries repeat
- you need to count earlier checkpoints that would make the current one valid

## When not to use it

Reach for a different tactic when these warning signs appear:

- updates happen between many queries and need a Fenwick tree or segment tree
- the operation is not invertible, such as minimum without extra structure
- overflow or numeric precision would break the accumulated value

## Terminology clues

These prompt words often point toward this concept:

- range sum
- subarray sum
- cumulative
- prefix
- running total
- queries
- difference of sums
- number of subarrays

## Problems that use it

- [42. Trapping Rain Water](../coding-problems/two-pointers/042-trapping-rain-water/)
- [238. Product of Array Except Self](../coding-problems/arrays-and-hashing/238-product-of-array-except-self/)
- [303. Range Sum Query - Immutable](../coding-problems/arrays-and-hashing/303-range-sum-query-immutable/)
- [560. Subarray Sum Equals K](../coding-problems/sliding-window/560-subarray-sum-equals-k/)
- [1010. Pairs of Songs With Total Durations Divisible by 60](../coding-problems/arrays-and-hashing/1010-pairs-of-songs-divisible-by-60/)

## Related concepts

- [Array scans](./array-scans/)
- [Hash map counting](./hash-map-counting/)
- [Difference arrays](./difference-arrays/)
