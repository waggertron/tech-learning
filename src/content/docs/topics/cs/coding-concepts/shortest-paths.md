---
title: Shortest Paths
description: "Path-cost tactics for finding minimum distance, time, risk, or transformation count through a graph."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Shortest-path algorithms model states as nodes and moves as edges. The algorithm depends on edge costs: BFS for equal costs, Dijkstra for non-negative weights, Bellman-Ford when negative edges or stop limits matter.

## Value

The value is choosing the right relaxation rule. The wrong path algorithm can be subtly incorrect even when it seems to work on small tests.

## Challenges this solves

- minimum travel time
- cheapest route
- fewest transformations
- grid risk levels
- probability maximization

## When to use it

Use it when the answer is the cheapest or shortest route through states.

## When not to use it

Do not use shortest-path machinery when only reachability matters. DFS, BFS, or union find is cheaper.

## Terminology clues

- shortest
- minimum cost
- cheapest
- network delay
- least effort
- fewest steps
- path weight

## Problems that use it

- [743. Network Delay Time](../coding-problems/advanced-graphs/743-network-delay-time/)
- [787. Cheapest Flights Within K Stops](../coding-problems/advanced-graphs/787-cheapest-flights-within-k-stops/)
- [778. Swim in Rising Water](../coding-problems/advanced-graphs/778-swim-in-rising-water/)
- [127. Word Ladder](../coding-problems/graphs/127-word-ladder/)

## Related concepts

- [BFS](./bfs/)
- [Dijkstra](./dijkstra/)
- [Bellman-Ford](./bellman-ford/)
- [Graph traversal](./graph-traversal/)
