---
title: Dijkstra
description: "Non-negative weighted shortest-path tactics using a priority queue frontier."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Dijkstra expands the unvisited state with the smallest known distance. A priority queue keeps the cheapest frontier candidate available.

The invariant depends on non-negative edge weights. Once a node is popped with the smallest distance, no later path can reach it more cheaply because every later edge only adds non-negative cost.

In interview code, lazy deletion is common: push improved distances onto the heap, and when an old larger distance is popped, skip it. That avoids needing a decrease-key operation.

## Value

The value is weighted shortest paths without trying every route. It generalizes BFS from equal-cost edges to non-negative weighted edges.

### Direct complexity example

- **Brute force:** Use BFS or enumerate paths on a weighted graph: BFS can return a wrong path, and path enumeration can be exponential.
- **With this tactic:** Use a heap frontier and relax edges: $O((V + E) \log V)$ time in common implementations.
- **Space:** Space is $O(V + E)$ for adjacency, $O(V)$ for distances, and up to $O(E)$ heap entries with lazy deletion.

## Challenges this solves

- network delay
- minimum effort path
- maximum probability with priority transformation
- weighted grid routes
- single-source non-negative shortest path

## When to use it

Use this tactic when these conditions are true:

- edge costs are non-negative
- the problem asks for cheapest path from one source
- the next best state should be processed first
- a priority queue frontier matches the cost model

## When not to use it

Reach for a different tactic when these warning signs appear:

- negative edge weights exist
- all edges have equal cost and BFS is simpler
- the graph is a DAG and topological DP is simpler
- the target is reachability rather than cost

## Terminology clues

These prompt words often point toward this concept:

- Dijkstra
- weighted graph
- non-negative
- priority queue
- network delay
- minimum effort
- shortest weighted path
- relax

## Problems that use it

- [743. Network Delay Time](../../coding-problems/advanced-graphs/743-network-delay-time/)
- [778. Swim in Rising Water](../../coding-problems/advanced-graphs/778-swim-in-rising-water/)
- [1514. Path with Maximum Probability](../../coding-problems/advanced-graphs/1514-path-with-maximum-probability/)

## Related concepts

- [Shortest paths](../shortest-paths/)
- [Heap and priority queue](../heap-and-priority-queue/)
- [BFS](../bfs/)
- [Bellman-Ford](../bellman-ford/)
