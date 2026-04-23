---
title: Heap / Priority Queue
description: 7 problems where a heap makes the difference between O(n log n) and O(n log k), or between infeasible and trivial streaming solutions.
parent: leetcode-150
tags: [leetcode, neetcode-150, heaps, priority-queue]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

A heap is the right data structure whenever you need:

- **Top-K anything** — maintain a size-K heap. The heap gives O(n log K) instead of O(n log n) sorting.
- **Streaming order statistics** — kth smallest/largest, running median, sliding-window extremes.
- **Scheduling with dynamic priorities** — reorganize, task scheduling, meeting rooms.
- **Greedy selection** — always take the best (cheapest, earliest, largest) element, then update.

Python: `heapq` is a min-heap on a list. Negate values for max-heap. Heaps don't support efficient arbitrary key lookup — pair with a hash map for "delete or update by key" (see Twitter).

## Problems

1. [703. Kth Largest Element in a Stream](./703-kth-largest-element-in-a-stream/) — *Easy*
2. [1046. Last Stone Weight](./1046-last-stone-weight/) — *Easy*
3. [973. K Closest Points to Origin](./973-k-closest-points-to-origin/) — *Medium*
4. [215. Kth Largest Element in an Array](./215-kth-largest-element-in-an-array/) — *Medium*
5. [621. Task Scheduler](./621-task-scheduler/) — *Medium*
6. [355. Design Twitter](./355-design-twitter/) — *Medium*
7. [295. Find Median from Data Stream](./295-find-median-from-data-stream/) — *Hard*

## Key patterns unlocked here

- **Size-K min-heap for online top-K** — 703.
- **Greedy selection with max-heap** — 1046.
- **Size-K heap by distance** — 973.
- **Quickselect vs. heap** — 215 (classic time vs. space trade-off).
- **Greedy scheduling with a counter and a max-heap** — 621.
- **Heap merge across per-user feeds** — 355.
- **Two heaps balancing a median** — 295 (canonical).
