---
title: Bellman-Ford
description: "Repeated-relaxation tactics for shortest paths with negative edges, bounded stops, or layered constraints."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Bellman-Ford relaxes all edges repeatedly. After `k` rounds, it has considered paths with at most `k` edges.

## Value

The value is edge-count control and negative-edge safety. It handles cases where Dijkstra's final-distance assumption is invalid.

## Challenges this solves

- cheapest flight with stop limit
- negative edge shortest paths
- detecting negative cycles
- layered route constraints

## When to use it

Use it when the number of edges in the path matters, or when edge weights may be negative.

## When not to use it

Do not use it by default on large non-negative graphs. Dijkstra is usually faster.

## Terminology clues

- at most k stops
- negative weight
- relax edges
- k edges
- bounded flights

## Problems that use it

- [787. Cheapest Flights Within K Stops](../coding-problems/advanced-graphs/787-cheapest-flights-within-k-stops/)
- [743. Network Delay Time](../coding-problems/advanced-graphs/743-network-delay-time/)

## Related concepts

- [Shortest paths](./shortest-paths/)
- [Dijkstra](./dijkstra/)
- [Dynamic programming](./dynamic-programming/)
