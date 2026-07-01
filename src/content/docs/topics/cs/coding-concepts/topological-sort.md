---
title: Topological Sort
description: "Dependency-order tactics for DAGs, prerequisites, and detecting cycles in directed graphs."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Topological sort orders directed nodes so every prerequisite appears before the thing that depends on it. It only exists for directed acyclic graphs.

The invariant is dependency satisfaction. Kahn style processing only removes nodes whose indegree is zero. DFS style processing appends a node after all nodes reachable from it are done, then reverses the result.

Cycle detection is built into the idea. If no zero-indegree node remains but unprocessed nodes still exist, or DFS sees a node already on the active path, the dependency set is contradictory.

## Value

The value is converting dependency constraints into a usable order. It also answers feasibility: a cycle means no valid ordering exists.

### Direct complexity example

- **Brute force:** Repeatedly search all courses for one whose prerequisites are done: $O(V^2 + E)$ time in a direct implementation.
- **With this tactic:** Track indegrees or DFS colors and process edges once: $O(V + E)$ time.
- **Space:** Space is $O(V + E)$ for adjacency plus $O(V)$ for indegrees, colors, queue, or recursion stack.

## Challenges this solves

- course schedule
- build order
- alien dictionary
- task prerequisites
- DAG dynamic programming

## When to use it

Use this tactic when these conditions are true:

- the graph is directed
- edges mean must come before or depends on
- the prompt asks for an ordering or whether all tasks can finish
- cycles are invalid

## When not to use it

Reach for a different tactic when these warning signs appear:

- the graph is undirected
- dependencies can be cyclic and still valid under the domain rules
- the problem asks for shortest path rather than order
- multiple orders need ranking by a separate priority not captured by plain topo sort

## Terminology clues

These prompt words often point toward this concept:

- prerequisite
- dependency
- course schedule
- build order
- DAG
- indegree
- before
- cycle

## Problems that use it

- [207. Course Schedule](../coding-problems/graphs/207-course-schedule/)
- [210. Course Schedule II](../coding-problems/graphs/210-course-schedule-ii/)
- [269. Alien Dictionary](../coding-problems/graphs/269-alien-dictionary/)

## Related concepts

- [Graph traversal](./graph-traversal/)
- [DFS](./dfs/)
- [BFS](./bfs/)
- [Cycle detection](./cycle-detection/)
