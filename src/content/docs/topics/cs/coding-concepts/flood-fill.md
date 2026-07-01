---
title: Flood Fill
description: "Grid traversal tactics for expanding through adjacent cells that share a condition."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Flood fill starts from a cell and visits neighboring cells that satisfy the same condition. DFS or BFS can drive the expansion.

## Value

The value is component discovery in grids. It turns matrix problems into graph traversal without building an explicit graph.

## Challenges this solves

- count islands
- capture regions
- area of a component
- multi-source reachability
- boundary-connected cells

## When to use it

Use it when grid cells connect through up, down, left, and right neighbors and the task is about regions.

## When not to use it

Do not use flood fill when movement has weights or costs. Shortest-path algorithms may be required.

## Terminology clues

- island
- region
- connected cells
- adjacent
- board
- water flow
- fill

## Problems that use it

- [200. Number of Islands](../coding-problems/graphs/200-number-of-islands/)
- [130. Surrounded Regions](../coding-problems/graphs/130-surrounded-regions/)
- [695. Max Area of Island](../coding-problems/graphs/695-max-area-of-island/)
- [417. Pacific Atlantic Water Flow](../coding-problems/graphs/417-pacific-atlantic-water-flow/)

## Related concepts

- [Graph traversal](./graph-traversal/)
- [DFS](./dfs/)
- [BFS](./bfs/)
- [Grid DP](./grid-dp/)
