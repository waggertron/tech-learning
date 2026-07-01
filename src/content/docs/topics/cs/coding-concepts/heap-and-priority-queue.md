---
title: Heap and Priority Queue
description: "Priority-frontier tactics for repeatedly extracting the smallest, largest, or most urgent item."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

A heap keeps the next highest-priority item available. In interviews, heap and priority queue usually mean the same operational tool: push items, pop the current min or max.

The invariant is that the root has the best priority among all stored items. The rest of the heap is only partially ordered, which is why extracting one best item is cheap but full ordering still needs repeated pops.

Use a heap when the next item changes as you process data. If priorities are static and you only need one full sorted order, sorting may be simpler.

## Value

The value is selective ordering. You do not sort every item when you only need the next best item at each step.

### Direct complexity example

- **Brute force:** Repeatedly scan an unsorted list to find the next best item: $O(n^2)$ time over `n` extractions.
- **With this tactic:** Build a heap and pop as needed: $O(n)$ heapify plus $O(\log n)$ per push or pop.
- **Space:** Space is $O(n)$ for the heap. For top-K with a bounded heap, space can be $O(k)$.

## Challenges this solves

- top K selection
- merge sorted streams
- median from data stream
- task scheduling
- Dijkstra frontier

## When to use it

Use this tactic when these conditions are true:

- you repeatedly need the smallest, largest, or most urgent item
- new candidates appear while processing
- keeping all items fully sorted is unnecessary
- the active set changes over time

## When not to use it

Reach for a different tactic when these warning signs appear:

- you need random access to arbitrary priorities
- all values can be sorted once and scanned
- the priority changes in place without a way to push a new entry or update safely
- K is tiny and a manual scan is clearer

## Terminology clues

These prompt words often point toward this concept:

- priority queue
- heap
- top K
- smallest
- largest
- median
- schedule
- next best

## Problems that use it

- [23. Merge k Sorted Lists](../coding-problems/linked-list/023-merge-k-sorted-lists/)
- [215. Kth Largest Element in an Array](../coding-problems/heap-priority-queue/215-kth-largest-element-in-an-array/)
- [295. Find Median from Data Stream](../coding-problems/heap-priority-queue/295-find-median-from-data-stream/)
- [355. Design Twitter](../coding-problems/heap-priority-queue/355-design-twitter/)
- [621. Task Scheduler](../coding-problems/heap-priority-queue/621-task-scheduler/)
- [703. Kth Largest Element in a Stream](../coding-problems/heap-priority-queue/703-kth-largest-element-in-a-stream/)
- [973. K Closest Points to Origin](../coding-problems/heap-priority-queue/973-k-closest-points-to-origin/)
- [1046. Last Stone Weight](../coding-problems/heap-priority-queue/1046-last-stone-weight/)

## Related concepts

- [Top K](./top-k/)
- [K-way merge](./k-way-merge/)
- [Dijkstra](./dijkstra/)
