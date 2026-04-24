---
title: "133. Clone Graph"
description: Deep copy a connected undirected graph.
parent: graphs
tags: [leetcode, neetcode-150, graphs, dfs, bfs, hash-tables, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a reference to a node in a connected undirected graph, return a **deep copy** (clone) of the graph. Each node has a value and a list of its neighbors.

LeetCode 133 · [Link](https://leetcode.com/problems/clone-graph/) · *Medium*

## Approach 1: DFS + hash map old → new

Walk the graph recursively; keep a dict mapping each original node to its clone. On each node, create the clone, then recursively clone neighbors.

```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors or []

def clone_graph(node):
    if not node:
        return None
    old_to_new = {}

    def dfs(n):
        if n in old_to_new:
            return old_to_new[n]
        copy = Node(n.val)
        old_to_new[n] = copy
        for nb in n.neighbors:
            copy.neighbors.append(dfs(nb))
        return copy

    return dfs(node)
```

**Complexity**
- **Time:** O(V + E).
- **Space:** O(V) map + O(V) recursion.

Canonical, cleanest.

## Approach 2: BFS + hash map

Same idea, queue-driven; useful when recursion depth is a concern.

```python
from collections import deque

def clone_graph(node):
    if not node:
        return None
    old_to_new = {node: Node(node.val)}
    q = deque([node])
    while q:
        cur = q.popleft()
        for nb in cur.neighbors:
            if nb not in old_to_new:
                old_to_new[nb] = Node(nb.val)
                q.append(nb)
            old_to_new[cur].neighbors.append(old_to_new[nb])
    return old_to_new[node]
```

**Complexity**
- **Time:** O(V + E).
- **Space:** O(V).

## Approach 3: Two-pass DFS (nodes first, edges second)

Pass 1: create every clone (no neighbor pointers). Pass 2: iterate original nodes and set each clone's neighbors from the map.

```python
def clone_graph(node):
    if not node:
        return None
    old_to_new = {}
    def build_nodes(n):
        if n in old_to_new:
            return
        old_to_new[n] = Node(n.val)
        for nb in n.neighbors:
            build_nodes(nb)
    build_nodes(node)
    for orig, clone in old_to_new.items():
        clone.neighbors = [old_to_new[nb] for nb in orig.neighbors]
    return old_to_new[node]
```

**Complexity**
- **Time:** O(V + E) across the two passes.
- **Space:** O(V).

Useful when neighbor lists are built from complex state you'd rather compute once.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| **DFS + old→new map** | **O(V + E)** | **O(V)** | Canonical |
| BFS + old→new map | O(V + E) | O(V) | Avoids deep recursion |
| Two-pass node-then-edges | O(V + E) | O(V) | Clear separation |

All three are optimal in Big-O. DFS is the shortest to write.

## Related data structures

- [Hash Tables](../../../data-structures/hash-tables/), old → new node mapping
- [Queues](../../../data-structures/queues/), BFS variant
