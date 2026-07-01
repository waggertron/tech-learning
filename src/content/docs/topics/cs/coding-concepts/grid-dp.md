---
title: Grid DP
description: "Row-column DP tactics for paths, matrix states, and local moves with directional dependencies."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Grid DP treats each cell as a state. The transition depends on allowed neighbor moves, often from top and left, or from all four directions with memoization.

## Value

The value is spatial structure. A 2D problem becomes a table where movement rules define dependencies.

## Challenges this solves

- count paths
- minimum path cost
- matrix reachability with cached DFS
- longest increasing path
- obstacle grids

## When to use it

Use it when each cell answer depends on nearby cells and the grid has repeated subproblems.

## When not to use it

Do not use grid DP for plain connected-component exploration without optimization. Flood fill or BFS is usually simpler.

## Terminology clues

- grid
- matrix
- path count
- move right or down
- cell value
- from each cell

## Problems that use it

- [62. Unique Paths](../coding-problems/2d-dynamic-programming/062-unique-paths/)
- [329. Longest Increasing Path in a Matrix](../coding-problems/2d-dynamic-programming/329-longest-increasing-path-in-a-matrix/)
- [417. Pacific Atlantic Water Flow](../coding-problems/graphs/417-pacific-atlantic-water-flow/)
- [542. 01 Matrix](../coding-problems/graphs/542-01-matrix/)

## Related concepts

- [Dynamic programming](./dynamic-programming/)
- [Flood fill](./flood-fill/)
- [BFS](./bfs/)
