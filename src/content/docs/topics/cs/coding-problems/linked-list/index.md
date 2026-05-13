---
title: Linked List
description: "14 problems covering pointer manipulation, cycle detection, two-pointer distance tricks, composite structures (LRU), and divide-and-conquer merges."
parent: coding-problems
tags: [leetcode, neetcode-150, linked-lists]
status: draft
created: 2026-04-23
updated: 2026-05-07
---

## Overview

Linked lists aren't dominant in production code anymore, dynamic arrays have better cache behavior, but they remain the workhorse of pointer-manipulation interviews. Mastering them means internalizing five patterns:

- **Reversal** (iterative and recursive): the building block under everything else.
- **Two-pointer slow/fast**: middle, cycle detection, n-from-end.
- **Dummy head node**: simplifies edge cases at the head.
- **Merging**: pointer splicing of sorted sequences.
- **Composite structures**: hash map + doubly linked list (LRU cache).

## Problems

1. [206. Reverse Linked List (Easy)](./206-reverse-linked-list/)
2. [21. Merge Two Sorted Lists (Easy)](./021-merge-two-sorted-lists/)
3. [141. Linked List Cycle (Easy)](./141-linked-list-cycle/)
4. [160. Intersection of Two Linked Lists (Easy)](./160-intersection-of-two-linked-lists/)
5. [876. Middle of the Linked List (Easy)](./876-middle-of-linked-list/)
6. [143. Reorder List (Medium)](./143-reorder-list/)
7. [19. Remove Nth Node From End of List (Medium)](./019-remove-nth-node-from-end-of-list/)
8. [24. Swap Nodes in Pairs (Medium)](./024-swap-nodes-in-pairs/)
9. [138. Copy List with Random Pointer (Medium)](./138-copy-list-with-random-pointer/)
10. [2. Add Two Numbers (Medium)](./002-add-two-numbers/)
11. [287. Find the Duplicate Number (Medium)](./287-find-the-duplicate-number/)
12. [146. LRU Cache (Medium)](./146-lru-cache/)
13. [23. Merge k Sorted Lists (Hard)](./023-merge-k-sorted-lists/)
14. [25. Reverse Nodes in k-Group (Hard)](./025-reverse-nodes-in-k-group/)

## Key patterns unlocked here

- **Three-pointer reversal**: 206 (iterative and recursive).
- **Two-pointer merge**: 21.
- **Floyd's tortoise and hare**: 141 (linked list), 287 (array-as-linked-list).
- **Find middle + reverse + interleave**: 143.
- **Offset-n two pointers**: 19.
- **Interwoven-copy technique for auxiliary pointers**: 138.
- **Digit-by-digit addition with carry**: 2.
- **Hash map + doubly linked list (LRU cache template)**: 146.
- **Divide-and-conquer merge or min-heap of heads**: 23.
- **Reverse-in-segments with bookkeeping**: 25.
