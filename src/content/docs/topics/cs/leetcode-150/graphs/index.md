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

Graphs are the most flexible category in the list, many problems that don't obviously look graph-shaped become tractable once modeled as one (grids are graphs; words are graphs; courses are a DAG). Master four algorithms and their variants:

- **BFS**, shortest path in unweighted graphs; multi-source BFS for "fire spreads from K starting points"; level-order traversal.
- **DFS**, connected components, cycle detection, topological sort (post-order).
- **Topological sort**, BFS (Kahn's, in-degree) or DFS (post-order reversed). DAG only.
- **Union-Find**, connectivity, incremental component merging, cycle detection in undirected graphs.

## Problems

1. [200. Number of Islands (Medium)](./200-number-of-islands/)
2. [695. Max Area of Island (Medium)](./695-max-area-of-island/)
3. [133. Clone Graph (Medium)](./133-clone-graph/)
4. [994. Rotting Oranges (Medium)](./994-rotting-oranges/)
5. [417. Pacific Atlantic Water Flow (Medium)](./417-pacific-atlantic-water-flow/)
6. [130. Surrounded Regions (Medium)](./130-surrounded-regions/)
7. [207. Course Schedule (Medium)](./207-course-schedule/)
8. [210. Course Schedule II (Medium)](./210-course-schedule-ii/)
9. [684. Redundant Connection (Medium)](./684-redundant-connection/)
10. [261. Graph Valid Tree (Medium)](./261-graph-valid-tree/)
11. [323. Number of Connected Components in an Undirected Graph (Medium)](./323-number-of-connected-components-in-an-undirected-graph/)
12. [127. Word Ladder (Hard)](./127-word-ladder/)
13. [269. Alien Dictionary (Hard)](./269-alien-dictionary/)

## Key patterns unlocked here

- **Grid DFS / BFS for connected components**, Number of Islands, Max Area of Island.
- **Copy-graph via old→new map**, Clone Graph.
- **Multi-source BFS**, Rotting Oranges.
- **Reverse-direction BFS / DFS**, Pacific Atlantic, Surrounded Regions.
- **Cycle detection + topological sort**, Course Schedule I/II.
- **Union-Find for incremental connectivity**, Redundant Connection, Graph Valid Tree, Number of Connected Components.
- **Word graphs and BFS on implicit edges**, Word Ladder.
- **Topological sort from ordering constraints**, Alien Dictionary.
