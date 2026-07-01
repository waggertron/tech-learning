---
title: K-way Merge
description: "Multi-stream ordering tactics for combining several sorted sources through one priority queue."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

K-way merge puts the current head of each sorted source into a heap. Each pop advances only the source that produced the smallest or largest item.

## Value

The value is avoiding a full flatten-and-sort. You preserve sorted structure across streams and pay for the active frontier.

## Challenges this solves

- merge k sorted lists
- top items from many feeds
- smallest range over lists
- multi-source stream merge

## When to use it

Use it when each input source is already sorted or naturally produces items in order.

## When not to use it

Do not use it when sources are unsorted and cannot produce ordered heads. You have no frontier guarantee.

## Terminology clues

- k sorted lists
- merge streams
- from each list
- next smallest across lists
- feed merge

## Problems that use it

- [23. Merge k Sorted Lists](../coding-problems/linked-list/023-merge-k-sorted-lists/)
- [355. Design Twitter](../coding-problems/heap-priority-queue/355-design-twitter/)
- [295. Find Median from Data Stream](../coding-problems/heap-priority-queue/295-find-median-from-data-stream/)

## Related concepts

- [Heap and priority queue](./heap-and-priority-queue/)
- [Top K](./top-k/)
- [Linked list pointer rewiring](./linked-list-pointer-rewiring/)
