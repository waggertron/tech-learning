---
title: Heap and Priority Queue
description: "Priority-frontier tactics for repeatedly extracting the smallest, largest, or most urgent item."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

A heap stores candidates by priority. Each pop gives the next best candidate without fully sorting the remaining items.

## Value

The value is incremental ordering. A heap is cheaper than sorting everything when only the next best few items matter.

## Challenges this solves

- top K elements
- streaming kth largest
- median maintenance
- task scheduling
- best-first graph search

## When to use it

Use it when the algorithm repeatedly needs the minimum, maximum, or next best item after updates.

## When not to use it

Do not use a heap if one full sort is enough and there are no incremental updates.

## Terminology clues

- kth largest
- top k
- median stream
- priority
- next smallest
- schedule tasks

## Problems that use it

- [215. Kth Largest Element in an Array](../coding-problems/heap-priority-queue/215-kth-largest-element-in-an-array/)
- [295. Find Median from Data Stream](../coding-problems/heap-priority-queue/295-find-median-from-data-stream/)
- [621. Task Scheduler](../coding-problems/heap-priority-queue/621-task-scheduler/)
- [355. Design Twitter](../coding-problems/heap-priority-queue/355-design-twitter/)

## Related concepts

- [Top K](./top-k/)
- [K-way merge](./k-way-merge/)
- [Dijkstra](./dijkstra/)
