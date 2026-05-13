---
title: Advanced Graphs
description: "8 problems covering Eulerian paths, MST (Prim/Kruskal), Dijkstra, Bellman-Ford, modified Dijkstra on grids, and Tarjan's bridge finding."
parent: coding-problems
tags: [leetcode, neetcode-150, graphs, dijkstra, mst, bellman-ford]
status: draft
created: 2026-04-23
updated: 2026-05-07
---

## Overview

The Graphs category taught BFS/DFS/Union-Find/topo sort. This category adds the **weighted** variants and a few niche algorithms:

- **Eulerian path**: visit every edge once (Reconstruct Itinerary, Hierholzer's).
- **Minimum spanning tree (MST)**: Prim's (priority queue) or Kruskal's (sort + union-find).
- **Single-source shortest path with non-negative weights**: Dijkstra.
- **Single-source shortest path with negative weights or bounded hops**: Bellman-Ford.
- **Dijkstra on implicit graphs**: grid "minimum max edge" problems.

## Problems

1. [332. Reconstruct Itinerary (Hard)](./332-reconstruct-itinerary/)
2. [1584. Min Cost to Connect All Points (Medium)](./1584-min-cost-to-connect-all-points/)
3. [743. Network Delay Time (Medium)](./743-network-delay-time/)
4. [787. Cheapest Flights Within K Stops (Medium)](./787-cheapest-flights-within-k-stops/)
5. [778. Swim in Rising Water (Hard)](./778-swim-in-rising-water/)

*Note: [269. Alien Dictionary](../graphs/269-alien-dictionary/) is sometimes categorized here. This site places it in the Graphs category since it's a topological-sort variant.*

**Bonus problems (same pattern, outside NeetCode 150):**

- [1192. Critical Connections in a Network (Hard)](./1192-critical-connections/) -- Tarjan's bridge algorithm using low values and discovery times.
- [1489. Critical and Pseudo-Critical Edges in MST (Hard)](./1489-critical-and-pseudo-critical-edges-in-mst/) -- Kruskal skip/force pattern to classify MST edges.
- [1514. Path with Maximum Probability (Medium)](./1514-path-with-max-probability/) -- Dijkstra with a max-heap and negated (or inverted) probabilities.

## Key patterns unlocked here

- **Hierholzer's algorithm for Eulerian paths**: Reconstruct Itinerary.
- **Prim's MST with a priority queue**: Min Cost to Connect All Points.
- **Dijkstra with heap**: Network Delay Time.
- **Bellman-Ford with hop limit**: Cheapest Flights Within K Stops.
- **Modified Dijkstra for min-max edge**: Swim in Rising Water.
- **Tarjan's bridge finding (low values and discovery times)**: Critical Connections.
- **MST manipulation with Kruskal skip/force pattern**: Critical and Pseudo-Critical Edges.
- **Dijkstra with maximization (negate weights or use max-heap)**: Path with Max Probability.
