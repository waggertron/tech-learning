---
title: DFS
description: "Depth-first traversal tactics for exploring one branch fully before backtracking to alternatives."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

DFS uses a call stack or explicit stack to go deep before going wide. It marks visited state and often returns information from children to parents.

## Value

The value is natural decomposition. DFS fits connected components, trees, path existence, and postorder dependency problems.

## Challenges this solves

- connected components
- cycle detection
- tree recursion
- grid islands
- topological reasoning
- subtree aggregation

## When to use it

Use it when depth, component membership, or child-to-parent return values matter.

## When not to use it

Do not use recursive DFS without care on very deep graphs. Iterative DFS or BFS may be safer.

## Terminology clues

- explore
- connected
- component
- path exists
- island
- subtree
- recursive

## Problems that use it

- [200. Number of Islands](../coding-problems/graphs/200-number-of-islands/)
- [695. Max Area of Island](../coding-problems/graphs/695-max-area-of-island/)
- [100. Same Tree](../coding-problems/trees/100-same-tree/)
- [133. Clone Graph](../coding-problems/graphs/133-clone-graph/)

## Related concepts

- [Graph traversal](./graph-traversal/)
- [Tree traversal](./tree-traversal/)
- [BFS](./bfs/)
- [Backtracking](./backtracking/)
