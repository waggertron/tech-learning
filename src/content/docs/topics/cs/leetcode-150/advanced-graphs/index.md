---
title: Advanced Graphs
description: 5 problems covering Eulerian paths, MST (Prim/Kruskal), Dijkstra, Bellman-Ford, and modified Dijkstra on grids.
parent: leetcode-150
tags: [leetcode, neetcode-150, graphs, dijkstra, mst, bellman-ford]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

The Graphs category taught BFS/DFS/Union-Find/topo sort. This category adds the **weighted** variants and a few niche algorithms:

- **Eulerian path** — visit every edge once (Reconstruct Itinerary, Hierholzer's).
- **Minimum spanning tree (MST)** — Prim's (priority queue) or Kruskal's (sort + union-find).
- **Single-source shortest path with non-negative weights** — Dijkstra.
- **Single-source shortest path with negative weights or bounded hops** — Bellman-Ford.
- **Dijkstra on implicit graphs** — grid "minimum max edge" problems.

## Problems

1. [332. Reconstruct Itinerary](./332-reconstruct-itinerary/) — *Hard*
2. [1584. Min Cost to Connect All Points](./1584-min-cost-to-connect-all-points/) — *Medium*
3. [743. Network Delay Time](./743-network-delay-time/) — *Medium*
4. [787. Cheapest Flights Within K Stops](./787-cheapest-flights-within-k-stops/) — *Medium*
5. [778. Swim in Rising Water](./778-swim-in-rising-water/) — *Hard*

*Note: [269. Alien Dictionary](../graphs/269-alien-dictionary/) is sometimes categorized here. This site places it in the Graphs category since it's a topological-sort variant.*

## Key patterns unlocked here

- **Hierholzer's algorithm for Eulerian paths** — Reconstruct Itinerary.
- **Prim's MST with a priority queue** — Min Cost to Connect All Points.
- **Dijkstra with heap** — Network Delay Time.
- **Bellman-Ford with hop limit** — Cheapest Flights Within K Stops.
- **Modified Dijkstra for min-max edge** — Swim in Rising Water.
