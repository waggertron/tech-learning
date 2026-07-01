---
title: Flood Fill
description: "Grid traversal tactics for expanding through adjacent cells that share a condition."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Flood fill expands from a starting cell through neighboring cells that share a condition. It is graph traversal on a grid with simple neighbor rules.

The invariant is region membership. Every visited cell belongs to the same connected region under the chosen directions and condition.

Implementation details matter more than theory: check bounds, check visited state, check the cell condition, then recurse or enqueue neighbors. Mark before exploring neighbors to avoid revisiting loops.

## Value

The value is turning a grid region into a component. You avoid scanning outward repeatedly from every cell by marking each cell once.

### Direct complexity example

- **Brute force:** For every cell, start a fresh region search without marking globally: up to $O((mn)^2)$ time.
- **With this tactic:** Visit each cell once across all fills: $O(mn)$ time.
- **Space:** Space is $O(mn)$ for visited in the worst case, or the same order for recursion stack or queue when a region fills the grid.

## Challenges this solves

- number of islands
- max island area
- surrounded regions
- image recoloring
- Pacific Atlantic style reachability

## When to use it

Use this tactic when these conditions are true:

- the input is a grid
- neighbors are up, down, left, right, or diagonal
- cells form connected regions by value or condition
- the answer asks for regions, area, border reachability, or fill

## When not to use it

Reach for a different tactic when these warning signs appear:

- movement has weights and asks for cheapest route
- the condition depends on path history rather than cell membership
- updates happen between queries
- the grid is actually a DP with acyclic directional movement

## Terminology clues

These prompt words often point toward this concept:

- island
- region
- fill
- connected cells
- grid
- matrix
- area
- surrounded

## Problems that use it

- [130. Surrounded Regions](../coding-problems/graphs/130-surrounded-regions/)
- [200. Number of Islands](../coding-problems/graphs/200-number-of-islands/)
- [417. Pacific Atlantic Water Flow](../coding-problems/graphs/417-pacific-atlantic-water-flow/)
- [695. Max Area of Island](../coding-problems/graphs/695-max-area-of-island/)

## Related concepts

- [Graph traversal](./graph-traversal/)
- [DFS](./dfs/)
- [BFS](./bfs/)
- [Grid DP](./grid-dp/)
