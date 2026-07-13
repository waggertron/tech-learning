---
title: Cycle Detection
description: "Repeated-state tactics for finding loops in linked lists, graphs, arrays, and numeric processes."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Cycle detection finds repeated states. The repeated state may be a linked-list node, graph node on the active DFS path, array index, or numeric value in a process.

The invariant depends on the structure. In a linked list or functional graph, fast and slow pointers detect repetition with constant memory. In a directed graph, DFS colors distinguish unvisited, visiting, and finished nodes.

The key is defining identity. Two states repeat only if the future from that state is the same. For numeric processes, the value may be enough. For search, the full position and mode may be needed.

## Value

The value is avoiding infinite loops and proving impossibility. Detecting a cycle often turns a simulation or traversal from unbounded to linear.

### Direct complexity example

- **Brute force:** Simulate until a step limit or repeatedly restart searches: unbounded or $O(VE)$ time depending on the workaround.
- **With this tactic:** Track visited states or use pointer meeting: $O(n)$ time for `n` reachable states.
- **Space:** Visited-set detection uses $O(n)$ space. Fast and slow pointer detection uses $O(1)$ space when every state has one deterministic successor.

## Challenges this solves

- linked list cycle
- course schedule
- happy number
- duplicate number
- directed graph cycle checks

## When to use it

Use this tactic when these conditions are true:

- states can repeat
- a repeated state implies the future will repeat
- the prompt asks whether a loop exists
- the structure has deterministic next pointers or directed dependencies

## When not to use it

Reach for a different tactic when these warning signs appear:

- the graph branches and fast/slow pointers do not apply
- the state identity is incomplete
- cycles are allowed and not an error
- the problem needs shortest distance to a cycle rather than detection only

## Terminology clues

These prompt words often point toward this concept:

- cycle
- loop
- repeated state
- visited
- currently visiting
- fast and slow
- circular
- never terminates

## Problems that use it

- [141. Linked List Cycle](../../coding-problems/linked-list/141-linked-list-cycle/)
- [202. Happy Number](../../coding-problems/math-and-geometry/202-happy-number/)
- [207. Course Schedule](../../coding-problems/graphs/207-course-schedule/)
- [287. Find the Duplicate Number](../../coding-problems/linked-list/287-find-the-duplicate-number/)
- [684. Redundant Connection](../../coding-problems/graphs/684-redundant-connection/)

## Related concepts

- [Fast and slow pointers](../fast-and-slow-pointers/)
- [Topological sort](../topological-sort/)
- [Union find](../union-find/)
- [DFS](../dfs/)
