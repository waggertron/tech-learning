---
title: Fast and Slow Pointers
description: "Pointer-speed tactics for cycle detection, middle finding, and linked-list distance constraints."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Fast and slow pointers run through the same structure at different speeds. If a cycle exists, the faster pointer eventually catches the slower one. If the fast pointer reaches the end, the slow pointer has a known relative position.

## Value

The value is space reduction. Problems that seem to need a visited set can often be solved with $O(1)$ memory when the structure behaves like a functional graph or list.

## Challenges this solves

- cycle detection
- cycle entry location
- middle of a list
- nth-from-end offsets
- repeated-state number processes

## When to use it

Use it when each state has one next state, especially linked lists, array-as-pointer problems, or numeric transformations that repeat.

## When not to use it

Do not use it on graphs where a node can branch to many next states. Branching traversal needs DFS, BFS, or explicit visited tracking.

## Terminology clues

- cycle
- linked list
- middle node
- repeated number
- find duplicate without extra space
- tortoise and hare

## Problems that use it

- [141. Linked List Cycle](../coding-problems/linked-list/141-linked-list-cycle/)
- [287. Find the Duplicate Number](../coding-problems/linked-list/287-find-the-duplicate-number/)
- [202. Happy Number](../coding-problems/math-and-geometry/202-happy-number/)
- [876. Middle of Linked List](../coding-problems/linked-list/876-middle-of-linked-list/)

## Related concepts

- [Cycle detection](./cycle-detection/)
- [Linked list pointer rewiring](./linked-list-pointer-rewiring/)
- [Graph traversal](./graph-traversal/)
