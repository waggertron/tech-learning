---
title: Advanced Graphs
description: "8 problems covering Eulerian paths, MST (Prim/Kruskal), Dijkstra, Bellman-Ford, modified Dijkstra on grids, and Tarjan's bridge finding."
parent: coding-problems
tags: [leetcode, neetcode-150, graphs, dijkstra, mst, bellman-ford]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Weighted graph problems

The Graphs category covers traversal, connected components, union-find, and topological sort. Advanced Graphs starts when the edges carry more meaning: cost, probability, arrival time, elevation, or "must use every edge exactly once." At that point, plain BFS and DFS no longer answer the question by themselves. You need an algorithm whose invariant matches the promise in the prompt.

The important move is choosing the right graph model before choosing code. A city map with travel times is a shortest-path problem. A set of points that all need to be connected is a minimum spanning tree problem. A list of tickets that must all be used is an Eulerian-path problem. A network where one removed edge disconnects the system is a bridge-finding problem.

- **Eulerian path**: visit every edge once (Reconstruct Itinerary, Hierholzer's).
- **Minimum spanning tree (MST)**: Prim's (priority queue) or Kruskal's (sort + union-find).
- **Single-source shortest path with non-negative weights**: Dijkstra.
- **Single-source shortest path with negative weights or bounded hops**: Bellman-Ford.
- **Dijkstra on implicit graphs**: grid "minimum max edge" problems.

## How to choose the algorithm

| Prompt shape | Reach for | Why |
| --- | --- | --- |
| "Cheapest", "fastest", "minimum delay" with non-negative edge weights | Dijkstra | The closest unfinished node is final once popped from the heap. |
| Same shortest-path language, but with a hop limit or negative weights | Bellman-Ford style relaxation | Each relaxation round means "paths using at most this many edges." |
| "Connect all points/cities with minimum total cost" | MST, Prim or Kruskal | The output is a connecting structure, not a route from one source. |
| "Use every ticket/edge exactly once" | Eulerian path, Hierholzer | The state is unused edges, not visited vertices. |
| "Which edges are critical?" | Tarjan bridge finding | Discovery times and low values reveal edges with no back route. |
| Grid where path cost is the maximum step/cell seen | Modified Dijkstra | The distance label stores the best bottleneck cost, not a sum. |

The most common mistake is forcing BFS onto weighted problems. BFS works when every edge has the same cost. The moment edge cost matters, queue order is no longer proof of optimality. The second common mistake is treating MST as shortest path. An MST minimizes the total cost to connect all nodes. It does not necessarily give the shortest path between any two nodes.

## Problems

1. [332. Reconstruct Itinerary (Hard)](./332-reconstruct-itinerary/)
2. [1584. Min Cost to Connect All Points (Medium)](./1584-min-cost-to-connect-all-points/)
3. [743. Network Delay Time (Medium)](./743-network-delay-time/)
4. [787. Cheapest Flights Within K Stops (Medium)](./787-cheapest-flights-within-k-stops/)
5. [778. Swim in Rising Water (Hard)](./778-swim-in-rising-water/)

*Note: [269. Alien Dictionary](../graphs/269-alien-dictionary/) is sometimes categorized here. This site places it in the Graphs category since it's a topological-sort variant.*

**Bonus problems (same pattern, outside NeetCode 150):**

- [1192. Critical Connections in a Network (Hard)](./1192-critical-connections/) -- Tarjan's bridge algorithm using low values and discovery times.
- [1489. Critical and Pseudo-Critical Edges in MST (Hard)](./1489-critical-and-pseudo-critical-edges/) -- Kruskal skip/force pattern to classify MST edges.
- [1514. Path with Maximum Probability (Medium)](./1514-path-with-maximum-probability/) -- Dijkstra with a max-heap and negated (or inverted) probabilities.

## Key patterns unlocked here

- **Hierholzer's algorithm for Eulerian paths**: Reconstruct Itinerary.
- **Prim's MST with a priority queue**: Min Cost to Connect All Points.
- **Dijkstra with heap**: Network Delay Time.
- **Bellman-Ford with hop limit**: Cheapest Flights Within K Stops.
- **Modified Dijkstra for min-max edge**: Swim in Rising Water.
- **Tarjan's bridge finding (low values and discovery times)**: Critical Connections.
- **MST manipulation with Kruskal skip/force pattern**: Critical and Pseudo-Critical Edges.
- **Dijkstra with maximization (negate weights or use max-heap)**: Path with Max Probability.

## How the problems fit together

Start with [Network Delay Time](./743-network-delay-time/) to lock in Dijkstra on an explicit weighted graph. Then use [Swim in Rising Water](./778-swim-in-rising-water/) to see the same heap discipline on an implicit grid with a different distance meaning. [Cheapest Flights Within K Stops](./787-cheapest-flights-within-k-stops/) is the contrast case: Dijkstra-like greediness is not enough because the hop constraint becomes part of the state.

The MST problems form a separate lane. [Min Cost to Connect All Points](./1584-min-cost-to-connect-all-points/) teaches the goal of connecting everything cheaply. [Critical and Pseudo-Critical Edges](./1489-critical-and-pseudo-critical-edges/) asks what changes when you force or remove one edge from that connecting structure.

[Reconstruct Itinerary](./332-reconstruct-itinerary/) and [Critical Connections](./1192-critical-connections/) are the specialty algorithms. They are worth knowing because their problem statements have unusually strong signals: every edge exactly once for Eulerian paths, and edge removal disconnecting the graph for bridges.

## Related concepts

- [Dijkstra](../../coding-concepts/dijkstra/), shortest paths with non-negative edge weights.
- [Bellman-Ford](../../coding-concepts/bellman-ford/), relaxation when edge count or negative weights matter.
- [Shortest paths](../../coding-concepts/shortest-paths/), the broader decision tree for weighted graph routes.
- [Union-find](../../coding-concepts/union-find/), the cycle detector behind Kruskal-style MST work.
- [Graph traversal](../../coding-concepts/graph-traversal/), the base layer these algorithms build on.
