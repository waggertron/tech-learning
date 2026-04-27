---
title: "323. Number of Connected Components in an Undirected Graph (Medium)"
description: Count connected components in an undirected graph.
parent: graphs
tags: [leetcode, neetcode-150, graphs, union-find, dfs, bfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `n` nodes labeled `0` to `n - 1` and a list of undirected edges, return the number of connected components.

**Example**
- `n = 5`, `edges = [[0,1],[1,2],[3,4]]` -> `2`
- `n = 5`, `edges = [[0,1],[1,2],[2,3],[3,4]]` -> `1`

LeetCode 323 (premium) · [Link](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) · *Medium*

## Approach 1: DFS

Walk each unvisited node; each DFS covers one component.

```python
from collections import defaultdict

def count_components(n, edges):
    graph = defaultdict(list)
    for u, v in edges:                  # L1: E iterations
        graph[u].append(v)              # L2: O(1) each
        graph[v].append(u)              # L3: O(1) each

    visited = set()

    def dfs(node):
        stack = [node]                  # L4: O(1) init
        while stack:                    # L5: visits each node once
            x = stack.pop()            # L6: O(1)
            if x in visited:
                continue
            visited.add(x)             # L7: O(1)
            for nb in graph[x]:        # L8: each edge traversed twice total
                if nb not in visited:
                    stack.append(nb)   # L9: O(1)

    count = 0
    for i in range(n):                 # L10: V iterations
        if i not in visited:
            count += 1
            dfs(i)                     # L11: O(V + E) total across all calls
    return count
```

**Where the time goes, line by line**

*Variables: V = n (number of nodes), E = len(edges).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (build adjacency list) | O(1) per edge | E | O(E) |
| L10 (outer loop) | O(1) | V | O(V) |
| **L5-L9 (DFS stack loop)** | **O(1) per node/edge** | **V nodes + 2E edge-visits total** | **O(V + E)** <- dominates |

Each node is added to `visited` exactly once and each edge is pushed onto the stack at most twice (once per direction). The total work across all `dfs()` calls is O(V + E), not O(V + E) per component.

**Complexity**
- **Time:** O(V + E), driven by L5-L9 summed across all DFS calls.
- **Space:** O(V + E) for the adjacency list and visited set; the stack holds at most V entries.

## Approach 2: BFS

Same structure, queue-driven.

```python
from collections import defaultdict, deque

def count_components(n, edges):
    graph = defaultdict(list)
    for u, v in edges:                  # L1: E iterations
        graph[u].append(v)              # L2: O(1)
        graph[v].append(u)              # L3: O(1)

    visited = set()
    count = 0
    for i in range(n):                  # L4: V iterations
        if i in visited:
            continue
        count += 1
        q = deque([i])                  # L5: O(1) init
        visited.add(i)
        while q:                        # L6: each node dequeued once
            x = q.popleft()            # L7: O(1)
            for nb in graph[x]:        # L8: each edge visited twice total
                if nb not in visited:
                    visited.add(nb)    # L9: O(1)
                    q.append(nb)       # L10: O(1)
    return count
```

**Where the time goes, line by line**

*Variables: V = n (number of nodes), E = len(edges).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (build adjacency list) | O(1) per edge | E | O(E) |
| L4 (outer loop) | O(1) | V | O(V) |
| **L6-L10 (BFS inner loop)** | **O(1) per node/edge** | **V nodes + 2E edge-visits total** | **O(V + E)** <- dominates |

Identical reasoning to DFS: each node enters the queue exactly once (guarded by the `visited.add` before enqueue), and each edge is checked twice.

**Complexity**
- **Time:** O(V + E), driven by L6-L10.
- **Space:** O(V + E) for the adjacency list; the queue holds at most V entries.

## Approach 3: Union-Find (optimal)

Start with `n` components. Each successful union reduces the count by 1.

```python
def count_components(n, edges):
    parent = list(range(n))             # L1: O(V)
    count = n                           # L2: O(1)

    def find(x):
        while parent[x] != x:          # L3: follows path to root
            parent[x] = parent[parent[x]]  # L4: path halving
            x = parent[x]
        return x

    for u, v in edges:                  # L5: E iterations
        ru, rv = find(u), find(v)      # L6: near-O(1) amortized per find
        if ru != rv:
            parent[ru] = rv            # L7: O(1) union
            count -= 1                 # L8: O(1)
    return count
```

**Where the time goes, line by line**

*Variables: V = n (number of nodes), E = len(edges).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init parent array) | O(V) | 1 | O(V) |
| **L5-L8 (edge processing loop)** | **O(alpha(V)) per edge** | **E** | **O(E * alpha(V))** <- dominates |

`find` with path halving (L3-L4) runs in amortized O(alpha(V)) per call, where alpha is the inverse Ackermann function -- effectively constant (never exceeds 4 for any practical input). The subtlety: this bound is amortized over a sequence of operations, not per individual call.

**Complexity**
- **Time:** O(V + E * alpha(V)), driven by L5-L8. Effectively O(V + E) in practice.
- **Space:** O(V) for the parent array; no adjacency list needed.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS | O(V + E) | O(V + E) |
| BFS | O(V + E) | O(V + E) |
| **Union-Find** | **O(V + E · alpha(V))** | **O(V)** |

All optimal. Pick union-find when edges arrive online or you also need "are u and v in the same component?" queries.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_323.py and run.
# Uses the canonical implementation (Approach 3: Union-Find).

def count_components(n, edges):
    parent = list(range(n))
    count = n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv
            count -= 1
    return count

def _run_tests():
    # Canonical example: two components
    assert count_components(5, [[0, 1], [1, 2], [3, 4]]) == 2

    # Single component spanning all nodes
    assert count_components(5, [[0, 1], [1, 2], [2, 3], [3, 4]]) == 1

    # No edges: every node is its own component
    assert count_components(4, []) == 4

    # Single node, no edges
    assert count_components(1, []) == 1

    # All nodes fully connected (complete graph on 3)
    assert count_components(3, [[0, 1], [1, 2], [0, 2]]) == 1

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Graphs](../../../data-structures/graphs/), connected components via any of the three
