---
title: Graph Traversal
description: "Visited-state tactics for exploring nodes, edges, components, and reachability relationships."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Graph traversal models inputs as nodes and edges, then uses DFS, BFS, or both to visit reachable states exactly once.

## Value

The value is recognizing hidden graphs. Grids, accounts, words, prerequisites, and routes often become clearer after naming nodes and edges.

## Challenges this solves

- reachability
- components
- cycle detection
- grid connectivity
- clone or copy graph
- state-space search

## When to use it

Use it when the problem is about moving between states, visiting connected items, or propagating information through relationships.

## When not to use it

Do not build an explicit graph when neighbors can be generated cheaply and the graph would be huge.

## Terminology clues

- connected
- neighbors
- reachable
- path
- component
- island
- course prerequisites
- adjacency

## Problems that use it

- [133. Clone Graph](../coding-problems/graphs/133-clone-graph/)
- [200. Number of Islands](../coding-problems/graphs/200-number-of-islands/)
- [417. Pacific Atlantic Water Flow](../coding-problems/graphs/417-pacific-atlantic-water-flow/)
- [721. Accounts Merge](../coding-problems/graphs/721-accounts-merge/)

## Related concepts

- [DFS](./dfs/)
- [BFS](./bfs/)
- [Union find](./union-find/)
- [Topological sort](./topological-sort/)
