---
title: Grid DP
description: "Row-column DP tactics for paths, matrix states, and local moves with directional dependencies."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Grid DP treats each cell as a state. The state represents the best cost, number of ways, or feasibility for reaching or leaving that cell.

The invariant comes from allowed movement. If movement is only right and down, top and left dependencies are enough. If movement can go in cycles, plain grid DP may fail and graph traversal or memoized DFS is safer.

Define the meaning of `dp[r][c]` before writing transitions. Then list all predecessor cells that can move into `(r, c)`. Obstacles, boundaries, and starting cells are base-case details, not afterthoughts.

## Value

The value is turning a two-dimensional path problem into local recurrence updates. It avoids enumerating every route through the grid.

### Direct complexity example

- **Brute force:** Enumerate all possible paths through an `m` by `n` grid: exponential time in path length.
- **With this tactic:** Fill each cell once with constant transition work: $O(mn)$ time.
- **Space:** A full table uses $O(mn)$ space. If only the previous row is needed, space drops to $O(n)$.

## Challenges this solves

- unique paths
- minimum path sum
- obstacle grids
- matrix path counts
- longest increasing path with memoization

## When to use it

Use this tactic when these conditions are true:

- the state is naturally a row and column
- moves have a direction that creates an acyclic dependency order
- the answer for a cell depends on neighboring solved cells
- the prompt asks for ways, min cost, or max path value

## When not to use it

Reach for a different tactic when these warning signs appear:

- movement allows arbitrary cycles without a visited rule
- the task asks for shortest unweighted distance and BFS is simpler
- the grid changes online
- the recurrence needs global information rather than local neighbors

## Terminology clues

These prompt words often point toward this concept:

- grid
- matrix
- cell
- path count
- minimum path
- obstacle
- row and column
- move right and down

## Problems that use it

- [62. Unique Paths](../../coding-problems/2d-dynamic-programming/062-unique-paths/)
- [329. Longest Increasing Path in a Matrix](../../coding-problems/2d-dynamic-programming/329-longest-increasing-path-in-a-matrix/)
- [417. Pacific Atlantic Water Flow](../../coding-problems/graphs/417-pacific-atlantic-water-flow/)
- [542. 01 Matrix](../../coding-problems/graphs/542-01-matrix/)

## Related concepts

- [Dynamic programming](../dynamic-programming/)
- [Flood fill](../flood-fill/)
- [BFS](../bfs/)
