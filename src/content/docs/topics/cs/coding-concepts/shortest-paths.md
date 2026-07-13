---
title: Shortest Paths
description: "Path-cost tactics for finding minimum distance, time, risk, or transformation count through a graph."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Shortest-path tactics model a problem as states connected by moves, then minimize the cost to reach a target. The right algorithm depends on edge costs.

The invariant is best known distance. BFS finalizes distance by layers when all edges cost the same. Dijkstra finalizes the smallest priority distance when weights are non-negative. Bellman-Ford relaxes edges repeatedly when negative edges or stop limits matter.

The modeling step is often harder than the algorithm. Decide what a node represents, what an edge represents, and what the edge cost means. A grid cell, word, city, or bitmask can all be graph states.

## Value

The value is using a proven frontier rule instead of enumerating every route. Once the state graph is right, the algorithm supplies the optimality proof.

### Direct complexity example

- **Brute force:** Enumerate all possible paths to the target: exponential time in graphs with branching and cycles.
- **With this tactic:** Use the right shortest-path algorithm: $O(V + E)$ for unweighted BFS, $O((V + E) \log V)$ for heap-based Dijkstra, or $O(VE)$ for Bellman-Ford.
- **Space:** Space is usually $O(V + E)$ for the graph plus $O(V)$ for distances and the frontier.

## Challenges this solves

- minimum transformations
- network delay
- grid minimum effort
- cheapest flights with stops
- maximum probability paths

## When to use it

Use this tactic when these conditions are true:

- the prompt asks for minimum steps, time, effort, cost, or risk
- states can be connected by legal moves
- cycles are possible and need distance tracking
- edge weights determine the algorithm choice

## When not to use it

Reach for a different tactic when these warning signs appear:

- the graph has no optimization target and plain traversal is enough
- all paths must be counted rather than minimized
- negative cycles can reduce cost indefinitely
- the state space is too large without additional pruning

## Terminology clues

These prompt words often point toward this concept:

- shortest
- minimum steps
- minimum cost
- network delay
- route
- distance
- edge weight
- path

## Problems that use it

- [127. Word Ladder](../../coding-problems/graphs/127-word-ladder/)
- [743. Network Delay Time](../../coding-problems/advanced-graphs/743-network-delay-time/)
- [778. Swim in Rising Water](../../coding-problems/advanced-graphs/778-swim-in-rising-water/)
- [787. Cheapest Flights Within K Stops](../../coding-problems/advanced-graphs/787-cheapest-flights-within-k-stops/)
- [1091. Shortest Path in Binary Matrix](../../coding-problems/graphs/1091-shortest-path-in-binary-matrix/)
- [1514. Path with Maximum Probability](../../coding-problems/advanced-graphs/1514-path-with-maximum-probability/)

## Related concepts

- [BFS](../bfs/)
- [Dijkstra](../dijkstra/)
- [Bellman-Ford](../bellman-ford/)
- [Graph traversal](../graph-traversal/)
