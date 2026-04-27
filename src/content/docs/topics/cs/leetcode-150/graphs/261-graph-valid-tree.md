---
title: "261. Graph Valid Tree (Medium)"
description: Determine whether an undirected graph is a valid tree (connected and acyclic).
parent: graphs
tags: [leetcode, neetcode-150, graphs, union-find, dfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `n` nodes labeled `0` to `n - 1` and a list of undirected edges, return `true` if the graph is a valid tree. A tree is connected and acyclic, which (given `n` nodes) means:

1. There are exactly `n - 1` edges.
2. The graph is connected.
3. The graph has no cycle.

(1) and (3) together imply connectivity in practice, but interviewers may want both checked explicitly.

**Example**
- `n = 5`, `edges = [[0,1],[0,2],[0,3],[1,4]]` → `true`
- `n = 5`, `edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]` → `false` (cycle 1-2-3-1)

LeetCode 261 (premium, equivalent in 323 context) · [Link](https://leetcode.com/problems/graph-valid-tree/) · *Medium*

## Approach 1: Brute force, DFS cycle + connected check

Build adjacency list. DFS from node 0 with parent tracking; if we reach a visited non-parent node, there's a cycle. After DFS, verify every node was visited.

```python
from collections import defaultdict

def valid_tree(n, edges):
    if len(edges) != n - 1:                    # L1: O(1) early exit
        return False   # for trees, |E| = n - 1
    graph = defaultdict(list)                  # L2: adjacency list
    for u, v in edges:                         # L3: O(E) to build
        graph[u].append(v)                     # L4: O(1) per edge
        graph[v].append(u)                     # L5: O(1) per edge (undirected)

    visited = set()                            # L6: visited set
    def dfs(node, parent):                     # L7: recursive DFS
        if node in visited:                    # L8: cycle detected
            return False
        visited.add(node)                      # L9: O(1)
        for nb in graph[node]:                 # L10: visit neighbors
            if nb == parent:                   # L11: skip tree-parent edge
                continue
            if not dfs(nb, node):              # L12: recurse
                return False
        return True

    return dfs(0, -1) and len(visited) == n    # L13: connectivity check
```

**Where the time goes, line by line**

*Variables: V = n (number of nodes), E = len(edges).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (edge count check) | O(1) | 1 | O(1) |
| L2-L5 (build graph) | O(1) per edge | E | O(E) |
| L6 (visited set) | O(1) | 1 | O(1) |
| **L10-L12 (neighbor traversal in DFS)** | **O(1) per edge** | **E total** | **O(V + E)** ← dominates |
| L13 (len check) | O(1) | 1 | O(1) |

Each node is visited at most once (L8 exits immediately on revisit), and each undirected edge is examined twice (once per endpoint). Total DFS work is O(V + E). The L1 guard means we never reach O(E) > O(n) inputs.

**Complexity**
- **Time:** O(V + E), driven by L10-L12 (each node and edge visited once).
- **Space:** O(V + E) for the graph and recursion stack.

## Approach 2: BFS cycle + connected check

Same idea, queue-driven.

```python
from collections import defaultdict, deque

def valid_tree(n, edges):
    if len(edges) != n - 1:                    # L1: O(1) early exit
        return False
    graph = defaultdict(list)                  # L2: adjacency list
    for u, v in edges:                         # L3: O(E) to build
        graph[u].append(v)                     # L4: O(1)
        graph[v].append(u)                     # L5: O(1)

    visited = {0}                              # L6: seed visited set
    q = deque([(0, -1)])                       # L7: (node, parent) queue
    while q:                                   # L8: BFS loop
        node, parent = q.popleft()             # L9: O(1)
        for nb in graph[node]:                 # L10: visit neighbors
            if nb == parent:                   # L11: skip tree-parent edge
                continue
            if nb in visited:                  # L12: cycle detected
                return False
            visited.add(nb)                    # L13: O(1) amortized
            q.append((nb, node))               # L14: O(1) amortized

    return len(visited) == n                   # L15: connectivity check
```

**Where the time goes, line by line**

*Variables: V = n (number of nodes), E = len(edges).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (edge count check) | O(1) | 1 | O(1) |
| L2-L5 (build graph) | O(1) per edge | E | O(E) |
| L6-L7 (seed) | O(1) | 1 | O(1) |
| L8-L9 (dequeue each node) | O(1) | V | O(V) |
| **L10-L14 (neighbor loop)** | **O(1) per edge** | **E total** | **O(V + E)** ← dominates |
| L15 (len check) | O(1) | 1 | O(1) |

Each node is added to `visited` before being enqueued, so no node enters the queue twice. Each undirected edge is examined once per endpoint. Total BFS work is O(V + E), identical to DFS but with an explicit stack instead of the call stack.

**Complexity**
- **Time:** O(V + E), driven by L10-L14 (every edge examined once per endpoint).
- **Space:** O(V + E) for the graph and queue.

## Approach 3: Union-Find (optimal, stops at first cycle)

For each edge, union the two endpoints. If any union finds them already in the same component, there's a cycle. At the end, check that exactly `n - 1` unions succeeded (equivalently, one component remains).

```python
def valid_tree(n, edges):
    if len(edges) != n - 1:                    # L1: O(1) early exit
        return False
    parent = list(range(n))                    # L2: O(n) init

    def find(x):                               # L3: path-compressed find
        while parent[x] != x:
            parent[x] = parent[parent[x]]      # L4: path halving, O(alpha(n)) amortized
            x = parent[x]                      # L5: move up
        return x

    for u, v in edges:                         # L6: O(E) edge loop
        ru, rv = find(u), find(v)              # L7: O(alpha(n)) each
        if ru == rv:                           # L8: same component = cycle
            return False
        parent[ru] = rv                        # L9: union, O(1)
    return True                                # L10: passed all edges, tree confirmed
```

**Where the time goes, line by line**

*Variables: V = n (number of nodes), E = len(edges).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (edge count check) | O(1) | 1 | O(1) |
| L2 (init parent) | O(n) | 1 | O(n) |
| **L6-L9 (edge loop with find + union)** | **O(alpha(n)) per edge** | **E** | **O(n · alpha(n))** ← dominates |

The `find` uses path halving (L4): each traversed node's parent is updated to its grandparent, flattening the tree aggressively. The amortized cost per `find` is O(alpha(n)), where alpha is the inverse Ackermann function, which is at most 4 for any input that fits in the universe. For all practical purposes this is O(1) per operation. With the L1 guard, E = n - 1 exactly, so the loop runs n - 1 times.

**Complexity**
- **Time:** O(n · alpha(n)) ≈ O(n), driven by L6-L9 (one find+union per edge).
- **Space:** O(n) for the parent array.

### Why `|E| == n - 1` matters
A connected graph on `n` vertices has at least `n - 1` edges. Trees have exactly `n - 1` edges. If we have `n - 1` edges and no cycle, the graph must be connected (otherwise we'd have a disconnected acyclic graph, i.e., a forest, which would need fewer than `n - 1` edges to span all components without a cycle).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS cycle + visited check | O(V + E) | O(V + E) |
| BFS cycle + visited check | O(V + E) | O(V + E) |
| **Union-Find** | **O(n · alpha)** | **O(n)** |

Union-Find is the shortest answer and generalizes to incremental graph construction. DFS/BFS are equivalent and often cleaner when you need to also walk the graph for other reasons.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_261.py and run.
# Uses Union-Find (Approach 3) as the canonical implementation.

def valid_tree(n, edges):
    if len(edges) != n - 1:
        return False
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            return False
        parent[ru] = rv
    return True

def _run_tests():
    # Example 1: valid tree
    assert valid_tree(5, [[0,1],[0,2],[0,3],[1,4]]) == True

    # Example 2: cycle present
    assert valid_tree(5, [[0,1],[1,2],[2,3],[1,3],[1,4]]) == False

    # Single node, no edges
    assert valid_tree(1, []) == True

    # Two nodes, one edge
    assert valid_tree(2, [[0, 1]]) == True

    # Two nodes, no edges (disconnected)
    assert valid_tree(2, []) == False

    # Too many edges (n edges instead of n-1)
    assert valid_tree(3, [[0,1],[1,2],[0,2]]) == False

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Graphs](../../../data-structures/graphs/), tree detection via union-find or DFS
