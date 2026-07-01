---
title: Dijkstra
description: "Non-negative weighted shortest-path tactics using a priority queue frontier."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Dijkstra repeatedly expands the unvisited node with the smallest known distance. A priority queue keeps the best frontier candidate on top.

## Value

The value is correctness under non-negative weights. Once a node is popped with the smallest distance, that distance is final.

## Challenges this solves

- network delay
- minimum effort grid path
- maximum probability path after converting priority
- weighted route planning

## When to use it

Use it when all edge costs are non-negative and the problem asks for cheapest weighted path from a source.

## When not to use it

Do not use Dijkstra with negative edge weights. Bellman-Ford or a problem-specific DP is required.

## Terminology clues

- weighted graph
- non-negative
- network delay
- minimum effort
- priority queue
- shortest weighted path

## Problems that use it

- [743. Network Delay Time](../coding-problems/advanced-graphs/743-network-delay-time/)
- [1514. Path with Maximum Probability](../coding-problems/advanced-graphs/1514-path-with-maximum-probability/)
- [778. Swim in Rising Water](../coding-problems/advanced-graphs/778-swim-in-rising-water/)

## Related concepts

- [Shortest paths](./shortest-paths/)
- [Heap and priority queue](./heap-and-priority-queue/)
- [BFS](./bfs/)
- [Bellman-Ford](./bellman-ford/)
