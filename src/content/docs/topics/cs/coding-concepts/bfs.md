---
title: BFS
description: "Breadth-first traversal tactics for level order, shortest unweighted paths, and expanding frontiers."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

BFS uses a queue to visit all states at distance `d` before distance `d + 1`. The first time a state is reached, it has the shortest unweighted distance.

## Value

The value is distance by construction. BFS gives shortest paths in unweighted graphs without extra relaxation logic.

## Challenges this solves

- level-order tree traversal
- shortest path in unweighted grids
- multi-source spread
- word transformation distance
- minimum moves

## When to use it

Use it when every edge or move has equal cost and the question asks for fewest steps or levels.

## When not to use it

Do not use plain BFS when edge costs vary. Dijkstra or Bellman-Ford handles weighted paths.

## Terminology clues

- shortest path
- minimum steps
- level order
- nearest
- spread
- minutes until

## Problems that use it

- [102. Binary Tree Level Order Traversal](../coding-problems/trees/102-binary-tree-level-order-traversal/)
- [994. Rotting Oranges](../coding-problems/graphs/994-rotting-oranges/)
- [127. Word Ladder](../coding-problems/graphs/127-word-ladder/)
- [1091. Shortest Path in Binary Matrix](../coding-problems/graphs/1091-shortest-path-in-binary-matrix/)

## Related concepts

- [Graph traversal](./graph-traversal/)
- [DFS](./dfs/)
- [Shortest paths](./shortest-paths/)
