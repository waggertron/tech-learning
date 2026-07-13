---
title: Union Find
description: "Disjoint-set tactics for tracking connected components as edges arrive."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Union find tracks which elements belong to the same connected component as edges arrive. It supports `find` to get a representative and `union` to merge two components.

The invariant is component identity. Two elements are connected exactly when their representatives match. Path compression and union by rank keep representative lookup nearly constant in practice.

Use union find when connectivity only grows. Each new edge can merge components or reveal that the edge connects two nodes already in the same component.

## Value

The value is avoiding repeated graph traversals after every edge. Instead of asking BFS to rediscover a component, the structure maintains components incrementally.

### Direct complexity example

- **Brute force:** After each edge, run DFS or BFS to test connectivity: $O(E(V + E))$ time in the worst case.
- **With this tactic:** Use `find` and `union` per edge: near $O(E)$ time in practice, more precisely $O(E \alpha(V))$ with standard optimizations.
- **Space:** Space is $O(V)$ for parent and rank or size arrays.

## Challenges this solves

- connected components
- redundant connection
- accounts merge
- minimum spanning tree
- offline grid connectivity

## When to use it

Use this tactic when these conditions are true:

- edges are added over time
- you need to know whether two nodes are already connected
- components only merge, not split
- cycle detection in an undirected graph is needed

## When not to use it

Reach for a different tactic when these warning signs appear:

- edges are deleted online
- you need shortest paths or traversal order
- the graph is directed and reachability is not symmetric
- component membership depends on labels that change after merging

## Terminology clues

These prompt words often point toward this concept:

- union
- find
- connected components
- same set
- redundant edge
- merge accounts
- Kruskal
- disjoint set

## Problems that use it

- [261. Graph Valid Tree](../../coding-problems/graphs/261-graph-valid-tree/)
- [323. Number of Connected Components in an Undirected Graph](../../coding-problems/graphs/323-number-of-connected-components-in-an-undirected-graph/)
- [547. Number of Provinces](../../coding-problems/graphs/547-number-of-provinces/)
- [684. Redundant Connection](../../coding-problems/graphs/684-redundant-connection/)
- [721. Accounts Merge](../../coding-problems/graphs/721-accounts-merge/)
- [1489. Find Critical and Pseudo-Critical Edges in MST](../../coding-problems/advanced-graphs/1489-critical-and-pseudo-critical-edges/)
- [1584. Min Cost to Connect All Points](../../coding-problems/advanced-graphs/1584-min-cost-to-connect-all-points/)

## Related concepts

- [Graph traversal](../graph-traversal/)
- [Cycle detection](../cycle-detection/)
- [Sorting as preprocessing](../sorting-as-preprocessing/)
