---
title: Topological Sort
description: "Dependency-order tactics for DAGs, prerequisites, and detecting cycles in directed graphs."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Topological sort orders directed nodes so every prerequisite appears before the node that depends on it. Kahn's algorithm removes zero-indegree nodes, while DFS uses postorder.

## Value

The value is making dependencies executable. It also detects directed cycles because a cycle has no valid topological order.

## Challenges this solves

- course scheduling
- build order
- alien dictionary order
- dependency resolution
- cycle detection in directed graphs

## When to use it

Use it when the problem gives prerequisites or asks whether all tasks can be completed.

## When not to use it

Do not use it on undirected graphs or directed graphs where cycles are valid behavior rather than an error.

## Terminology clues

- prerequisite
- before
- depends on
- order tasks
- DAG
- course schedule
- alien dictionary

## Problems that use it

- [207. Course Schedule](../coding-problems/graphs/207-course-schedule/)
- [210. Course Schedule II](../coding-problems/graphs/210-course-schedule-ii/)
- [269. Alien Dictionary](../coding-problems/graphs/269-alien-dictionary/)

## Related concepts

- [Graph traversal](./graph-traversal/)
- [DFS](./dfs/)
- [BFS](./bfs/)
- [Cycle detection](./cycle-detection/)
