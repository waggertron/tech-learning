---
title: Union Find
description: "Disjoint-set tactics for tracking connected components as edges arrive."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Union find stores a parent pointer for each item. `find` returns the component representative, and `union` merges two components.

## Value

The value is near-constant-time connectivity. It is ideal when edges are processed one by one and the question is about components.

## Challenges this solves

- number of connected components
- cycle in undirected graph
- redundant edge
- accounts merge
- minimum spanning tree support

## When to use it

Use it when connectivity changes through unions and queries ask whether two nodes are already connected.

## When not to use it

Do not use union find when you need path details, shortest distance, or directed dependency order.

## Terminology clues

- connected components
- same group
- merge accounts
- redundant connection
- undirected graph
- disjoint set

## Problems that use it

- [323. Number of Connected Components](../coding-problems/graphs/323-number-of-connected-components-in-an-undirected-graph/)
- [684. Redundant Connection](../coding-problems/graphs/684-redundant-connection/)
- [721. Accounts Merge](../coding-problems/graphs/721-accounts-merge/)
- [261. Graph Valid Tree](../coding-problems/graphs/261-graph-valid-tree/)

## Related concepts

- [Graph traversal](./graph-traversal/)
- [Cycle detection](./cycle-detection/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
