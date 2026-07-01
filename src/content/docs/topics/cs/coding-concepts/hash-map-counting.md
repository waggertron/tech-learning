---
title: Hash Map Counting
description: "Frequency-table tactics for turning membership, complement, and multiplicity questions into direct lookups."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Hash map counting records what has been seen and how often. The current element asks the table for a complement, a previous count, or a canonical key.

## Value

The value is memory for time. A table replaces repeated search with average $O(1)$ lookup.

## Challenges this solves

- two-sum complements
- anagram grouping
- frequency comparison
- top frequency extraction
- subarray count by prefix value

## When to use it

Use it when identity, count, or complement matters more than order.

## When not to use it

Do not use it when the problem depends on sorted adjacency, range order, or next-greater structure. A sort, heap, or stack may preserve the missing relationship.

## Terminology clues

- count
- frequency
- anagram
- duplicate
- complement
- seen before
- group by

## Problems that use it

- [1. Two Sum](../coding-problems/arrays-and-hashing/001-two-sum/)
- [49. Group Anagrams](../coding-problems/arrays-and-hashing/049-group-anagrams/)
- [347. Top K Frequent Elements](../coding-problems/arrays-and-hashing/347-top-k-frequent-elements/)
- [560. Subarray Sum Equals K](../coding-problems/sliding-window/560-subarray-sum-equals-k/)

## Related concepts

- [Prefix sums](./prefix-sums/)
- [Top K](./top-k/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
