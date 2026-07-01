---
title: Top K
description: "Selection tactics for finding the largest, smallest, or most frequent K items without fully ordering everything."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Top K solutions keep only the K candidates that matter. Common tools are a size-K heap, bucket counts, quickselect, or partial sorting.

## Value

The value is focusing work on the requested slice of the ordering rather than the whole order.

## Challenges this solves

- kth largest
- k closest
- top frequencies
- streaming top K
- ranked candidates

## When to use it

Use it when the output size is K and K is smaller than the input, or when data arrives as a stream.

## When not to use it

Do not use a heap when the problem needs every item sorted. Full sort may be simpler and not asymptotically worse.

## Terminology clues

- top k
- kth
- k closest
- most frequent
- largest k
- smallest k

## Problems that use it

- [347. Top K Frequent Elements](../coding-problems/arrays-and-hashing/347-top-k-frequent-elements/)
- [215. Kth Largest Element in an Array](../coding-problems/heap-priority-queue/215-kth-largest-element-in-an-array/)
- [973. K Closest Points to Origin](../coding-problems/heap-priority-queue/973-k-closest-points-to-origin/)
- [703. Kth Largest Element in a Stream](../coding-problems/heap-priority-queue/703-kth-largest-element-in-a-stream/)

## Related concepts

- [Heap and priority queue](./heap-and-priority-queue/)
- [Hash map counting](./hash-map-counting/)
- [Divide and conquer](./divide-and-conquer/)
