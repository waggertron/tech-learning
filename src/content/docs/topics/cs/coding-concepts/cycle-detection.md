---
title: Cycle Detection
description: "Repeated-state tactics for finding loops in linked lists, graphs, arrays, and numeric processes."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Cycle detection proves whether a traversal can revisit a state. Tools include visited sets, DFS colors, union find, and fast/slow pointers.

## Value

The value is preventing infinite traversal and recognizing invalid dependency structures.

## Challenges this solves

- linked-list loops
- directed graph cycles
- undirected redundant edges
- repeated numeric states
- duplicate number as cycle

## When to use it

Use it when states point to other states and revisiting a state changes the answer.

## When not to use it

Do not use one cycle tactic everywhere. Directed graph cycles, undirected cycles, and functional graph cycles need different tools.

## Terminology clues

- cycle
- loop
- revisit
- can finish all
- duplicate points to index
- infinite process

## Problems that use it

- [141. Linked List Cycle](../coding-problems/linked-list/141-linked-list-cycle/)
- [207. Course Schedule](../coding-problems/graphs/207-course-schedule/)
- [684. Redundant Connection](../coding-problems/graphs/684-redundant-connection/)
- [202. Happy Number](../coding-problems/math-and-geometry/202-happy-number/)

## Related concepts

- [Fast and slow pointers](./fast-and-slow-pointers/)
- [Topological sort](./topological-sort/)
- [Union find](./union-find/)
- [DFS](./dfs/)
