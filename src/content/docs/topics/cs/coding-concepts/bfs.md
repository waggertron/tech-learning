---
title: BFS
description: "Breadth-first traversal tactics for level order, shortest unweighted paths, and expanding frontiers."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

BFS explores a graph in waves. It processes all nodes at distance `d` before any node at distance `d + 1`.

The invariant is level order. When an unweighted node is first removed from the queue, the path used to reach it has the fewest edges from the start.

Use a queue, mark nodes when they are enqueued, and store distance or step count with each layer. Marking on enqueue prevents the same node from filling the queue many times.

## Value

The value is shortest unweighted distance and controlled frontier growth. BFS gives a proof of minimal steps without comparing every possible path.

### Direct complexity example

- **Brute force:** Explore all paths until one reaches the target: exponential in path length for graphs with branching.
- **With this tactic:** Visit each node and edge once with a queue: $O(V + E)$ time.
- **Space:** Space is $O(V)$ for visited and the queue. On grids, the frontier can hold a full layer of cells.

## Challenges this solves

- shortest path in an unweighted graph
- rotting oranges style wave spread
- word ladder transformations
- level order tree traversal
- multi-source distance

## When to use it

Use this tactic when these conditions are true:

- each edge or move has equal cost
- the prompt asks for minimum number of steps
- many sources start at distance zero
- the process spreads outward one layer at a time

## When not to use it

Reach for a different tactic when these warning signs appear:

- edges have different positive weights and Dijkstra is needed
- negative weights appear
- the answer needs one deep valid path rather than shortest distance
- memory for a wide frontier is too high and DFS is acceptable

## Terminology clues

These prompt words often point toward this concept:

- minimum steps
- shortest path
- level order
- queue
- nearest
- spread
- minutes
- unweighted

## Problems that use it

- [102. Binary Tree Level Order Traversal](../../coding-problems/trees/102-binary-tree-level-order-traversal/)
- [127. Word Ladder](../../coding-problems/graphs/127-word-ladder/)
- [199. Binary Tree Right Side View](../../coding-problems/trees/199-binary-tree-right-side-view/)
- [542. 01 Matrix](../../coding-problems/graphs/542-01-matrix/)
- [785. Is Graph Bipartite?](../../coding-problems/graphs/785-is-graph-bipartite/)
- [886. Possible Bipartition](../../coding-problems/graphs/886-possible-bipartition/)
- [994. Rotting Oranges](../../coding-problems/graphs/994-rotting-oranges/)
- [1091. Shortest Path in Binary Matrix](../../coding-problems/graphs/1091-shortest-path-in-binary-matrix/)

## Related concepts

- [Graph traversal](../graph-traversal/)
- [DFS](../dfs/)
- [Shortest paths](../shortest-paths/)
