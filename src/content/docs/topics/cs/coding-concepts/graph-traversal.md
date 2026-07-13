---
title: Graph Traversal
description: "Visited-state tactics for exploring nodes, edges, components, and reachability relationships."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Graph traversal explores nodes and edges while preventing repeated work. DFS and BFS are the two main traversal modes, but the shared idea is visited state.

The invariant is that every processed node has been reached by a valid path from some start. The visited set divides the graph into known and unknown regions.

Representation is part of the tactic. Build an adjacency list for arbitrary node labels, use directional offsets for grids, and decide whether edges are directed before traversal begins.

## Value

The value is turning relationships into a systematic walk. Traversal avoids restarting from scratch for every query and prevents cycles from creating infinite loops.

### Direct complexity example

- **Brute force:** For each node, scan the whole edge list to find neighbors: $O(VE)$ time in dense implementations.
- **With this tactic:** Build adjacency once and traverse: $O(V + E)$ time.
- **Space:** Space is $O(V + E)$ for adjacency plus $O(V)$ for visited and stack or queue.

## Challenges this solves

- reachability
- connected components
- clone graph
- course prerequisites
- grid islands
- bipartite checks

## When to use it

Use this tactic when these conditions are true:

- entities are connected by relationships
- the input has edges, adjacency, or neighbor moves
- cycles or disconnected components are possible
- the answer depends on what can be reached

## When not to use it

Reach for a different tactic when these warning signs appear:

- the graph is weighted and asks for minimum cost
- the problem is just dependency ordering and topological sort gives the final form
- the data is a tree with no cycles and simpler tree traversal works
- the graph changes online and needs dynamic connectivity

## Terminology clues

These prompt words often point toward this concept:

- graph
- edge
- node
- neighbor
- connected
- component
- reachable
- visited

## Problems that use it

- [133. Clone Graph](../../coding-problems/graphs/133-clone-graph/)
- [200. Number of Islands](../../coding-problems/graphs/200-number-of-islands/)
- [210. Course Schedule II](../../coding-problems/graphs/210-course-schedule-ii/)
- [261. Graph Valid Tree](../../coding-problems/graphs/261-graph-valid-tree/)
- [269. Alien Dictionary](../../coding-problems/graphs/269-alien-dictionary/)
- [323. Number of Connected Components in an Undirected Graph](../../coding-problems/graphs/323-number-of-connected-components-in-an-undirected-graph/)
- [417. Pacific Atlantic Water Flow](../../coding-problems/graphs/417-pacific-atlantic-water-flow/)
- [547. Number of Provinces](../../coding-problems/graphs/547-number-of-provinces/)
- [721. Accounts Merge](../../coding-problems/graphs/721-accounts-merge/)
- [785. Is Graph Bipartite?](../../coding-problems/graphs/785-is-graph-bipartite/)
- [886. Possible Bipartition](../../coding-problems/graphs/886-possible-bipartition/)
- [994. Rotting Oranges](../../coding-problems/graphs/994-rotting-oranges/)
- [1192. Critical Connections in a Network](../../coding-problems/advanced-graphs/1192-critical-connections/)

## Related concepts

- [DFS](../dfs/)
- [BFS](../bfs/)
- [Union find](../union-find/)
- [Topological sort](../topological-sort/)
