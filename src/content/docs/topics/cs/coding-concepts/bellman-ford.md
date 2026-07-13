---
title: Bellman-Ford
description: "Repeated-relaxation tactics for shortest paths with negative edges, bounded stops, or layered constraints."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Bellman-Ford repeatedly relaxes every edge. After one full pass, shortest paths using at most one edge are known. After `k` passes, paths using at most `k` edges are known.

The invariant is path length by edge count. With no negative cycle reachable from the source, `V - 1` passes are enough because a simple shortest path uses at most `V - 1` edges.

This repeated-relaxation view also fits bounded-stop problems. If a flight can use at most `K` stops, each round represents one more allowed edge, and a copied distance array prevents using too many edges in one round.

## Value

The value is handling cases that Dijkstra cannot handle safely: negative weights, negative-cycle detection, and explicit edge-count limits.

### Direct complexity example

- **Brute force:** Try all paths up to a stop limit or use Dijkstra with negative edges and risk wrong finalization: exponential or incorrect.
- **With this tactic:** Relax all edges for a fixed number of rounds: $O(VE)$ for full Bellman-Ford, or $O(KE)$ for `K` bounded rounds.
- **Space:** Space is $O(V)$ for distances, or $O(V)$ per copied layer when preserving previous-round values.

## Challenges this solves

- cheapest flights with K stops
- negative weighted shortest paths
- negative cycle detection
- layered route constraints

## When to use it

Use this tactic when these conditions are true:

- edge weights can be negative
- the number of edges or stops is bounded
- you need to detect a negative cycle
- the graph is represented naturally as an edge list

## When not to use it

Reach for a different tactic when these warning signs appear:

- all weights are non-negative and Dijkstra is faster
- all edges have equal cost and BFS is simpler
- the graph is large and `VE` is too expensive
- negative cycles make the optimum undefined

## Terminology clues

These prompt words often point toward this concept:

- negative weight
- K stops
- bounded edges
- relax all edges
- Bellman-Ford
- negative cycle
- edge list
- cheapest flight

## Problems that use it

- [743. Network Delay Time](../../coding-problems/advanced-graphs/743-network-delay-time/)
- [787. Cheapest Flights Within K Stops](../../coding-problems/advanced-graphs/787-cheapest-flights-within-k-stops/)

## Related concepts

- [Shortest paths](../shortest-paths/)
- [Dijkstra](../dijkstra/)
- [Dynamic programming](../dynamic-programming/)
