---
title: K-way Merge
description: "Multi-stream ordering tactics for combining several sorted sources through one priority queue."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

K-way merge combines several sorted streams into one sorted stream. A heap stores the current front item from each stream.

The invariant is that the heap contains the smallest unconsumed candidate from each non-empty stream. Popping the heap gives the next global item, then the next item from that same stream enters the heap.

The stream identity matters. Heap entries usually store the value plus which list or index it came from, so the algorithm can advance the correct source after popping.

## Value

The value is avoiding repeated scans across all streams. Sorting all values again ignores the fact that each input is already sorted.

### Direct complexity example

- **Brute force:** Concatenate all `N` values and sort them: $O(N \log N)$ time.
- **With this tactic:** Keep one heap entry per stream: $O(N \log k)$ time for `k` streams.
- **Space:** Space is $O(k)$ for the heap, plus output. For linked lists, nodes can often be rewired instead of copied.

## Challenges this solves

- merge k sorted lists
- smallest range covering lists
- kth smallest in sorted matrix
- multi-source event streams

## When to use it

Use this tactic when these conditions are true:

- there are multiple sorted inputs
- you only need the next global smallest each step
- each stream can advance one item at a time
- k is smaller than the total number of items

## When not to use it

Reach for a different tactic when these warning signs appear:

- the inputs are not sorted
- random access and binary search across arrays gives a better specialized solution
- k is one or two and simple two-pointer merge is clearer
- all values must be resorted by a different key

## Terminology clues

These prompt words often point toward this concept:

- k sorted
- merge lists
- streams
- smallest range
- next smallest
- sorted matrix
- priority queue
- multiway

## Problems that use it

- [23. Merge k Sorted Lists](../coding-problems/linked-list/023-merge-k-sorted-lists/)
- [295. Find Median from Data Stream](../coding-problems/heap-priority-queue/295-find-median-from-data-stream/)
- [355. Design Twitter](../coding-problems/heap-priority-queue/355-design-twitter/)

## Related concepts

- [Heap and priority queue](./heap-and-priority-queue/)
- [Top K](./top-k/)
- [Linked list pointer rewiring](./linked-list-pointer-rewiring/)
