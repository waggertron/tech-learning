---
title: Graphs
description: 13 problems covering BFS, DFS, multi-source BFS, topological sort, union-find, and the most common modeling tricks (grids as graphs, words as graphs).
parent: leetcode-150
tags: [leetcode, neetcode-150, graphs]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Graphs are the most flexible category in the list — many problems that don't obviously look graph-shaped become tractable once modeled as one (grids are graphs; words are graphs; courses are a DAG). Master four algorithms and their variants:

- **BFS** — shortest path in unweighted graphs; multi-source BFS for "fire spreads from K starting points"; level-order traversal.
- **DFS** — connected components, cycle detection, topological sort (post-order).
- **Topological sort** — BFS (Kahn's, in-degree) or DFS (post-order reversed). DAG only.
- **Union-Find** — connectivity, incremental component merging, cycle detection in undirected graphs.

## Problems

1. [200. Number of Islands](./200-number-of-islands/) — *Medium*
2. [695. Max Area of Island](./695-max-area-of-island/) — *Medium*
3. [133. Clone Graph](./133-clone-graph/) — *Medium*
4. [994. Rotting Oranges](./994-rotting-oranges/) — *Medium*
5. [417. Pacific Atlantic Water Flow](./417-pacific-atlantic-water-flow/) — *Medium*
6. [130. Surrounded Regions](./130-surrounded-regions/) — *Medium*
7. [207. Course Schedule](./207-course-schedule/) — *Medium*
8. [210. Course Schedule II](./210-course-schedule-ii/) — *Medium*
9. [684. Redundant Connection](./684-redundant-connection/) — *Medium*
10. [261. Graph Valid Tree](./261-graph-valid-tree/) — *Medium*
11. [323. Number of Connected Components in an Undirected Graph](./323-number-of-connected-components-in-an-undirected-graph/) — *Medium*
12. [127. Word Ladder](./127-word-ladder/) — *Hard*
13. [269. Alien Dictionary](./269-alien-dictionary/) — *Hard*

## Key patterns unlocked here

- **Grid DFS / BFS for connected components** — Number of Islands, Max Area of Island.
- **Copy-graph via old→new map** — Clone Graph.
- **Multi-source BFS** — Rotting Oranges.
- **Reverse-direction BFS / DFS** — Pacific Atlantic, Surrounded Regions.
- **Cycle detection + topological sort** — Course Schedule I/II.
- **Union-Find for incremental connectivity** — Redundant Connection, Graph Valid Tree, Number of Connected Components.
- **Word graphs and BFS on implicit edges** — Word Ladder.
- **Topological sort from ordering constraints** — Alien Dictionary.
