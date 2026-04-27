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

## Approach 1: DFS + hash map old -> new

Walk the graph recursively; keep a dict mapping each original node to its clone. On each node, create the clone, then recursively clone neighbors.

```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors or []

def clone_graph(node):
    if not node:                               # L1: O(1) null guard
        return None
    old_to_new = {}                            # L2: O(1) init map

    def dfs(n):
        if n in old_to_new:                    # L3: O(1) already cloned
            return old_to_new[n]
        copy = Node(n.val)                     # L4: O(1) create clone
        old_to_new[n] = copy                   # L5: O(1) register before recursing (cycle safety)
        for nb in n.neighbors:
            copy.neighbors.append(dfs(nb))     # L6: O(1) per edge, recurse each neighbor
        return copy

    return dfs(node)
```

**Where the time goes, line by line**

*Variables: V = number of nodes in the graph, E = number of edges.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3 (cache hit check) | O(1) | V total across all calls | O(V) |
| L4 (create clone) | O(1) | V (one per node) | O(V) |
| L5 (register in map) | O(1) | V | O(V) |
| **L6 (neighbor loop)** | **O(1) per edge** | **E total across all calls** | **O(E)** ← dominates for dense graphs |

Each node is created exactly once (L3 short-circuits revisits). Each edge is traversed exactly once per direction in an undirected graph, so the neighbor loop across all nodes totals O(E). The map lookup/insert at L3/L5 is O(1) average for a hash map. Total: O(V + E).

**Complexity**
- **Time:** O(V + E), driven by L6 (each edge visited once per direction).
- **Space:** O(V) for the hash map, plus O(V) recursion stack depth in the worst case (a path graph).

Canonical, cleanest.

## Approach 2: BFS + hash map

Same idea, queue-driven; useful when recursion depth is a concern.

```python
from collections import deque

def clone_graph(node):
    if not node:                               # L1: O(1) null guard
        return None
    old_to_new = {node: Node(node.val)}        # L2: O(1) seed map with root
    q = deque([node])                          # L3: O(1) init queue
    while q:                                   # L4: loop until queue empty
        cur = q.popleft()                      # L5: O(1) dequeue
        for nb in cur.neighbors:               # L6: O(degree) per node
            if nb not in old_to_new:
                old_to_new[nb] = Node(nb.val)  # L7: O(1) create clone once
                q.append(nb)                   # L8: O(1) enqueue for later
            old_to_new[cur].neighbors.append(old_to_new[nb])  # L9: O(1) wire edge
    return old_to_new[node]
```

**Where the time goes, line by line**

*Variables: V = number of nodes in the graph, E = number of edges.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2, L3 (init) | O(1) | 1 | O(1) |
| L5 (dequeue) | O(1) | V | O(V) |
| L7 (create clone) | O(1) | V | O(V) |
| L8 (enqueue) | O(1) | V | O(V) |
| **L6, L9 (edge wiring)** | **O(1) per edge** | **E total** | **O(E)** ← dominates for dense graphs |

Each node is enqueued and dequeued exactly once. Each edge is wired at L9 exactly once per direction. The queue size is bounded by O(V) in the worst case (a star graph where the center fans out to all other nodes).

**Complexity**
- **Time:** O(V + E), driven by L6/L9 (iterating every edge).
- **Space:** O(V) for the map and queue.

## Approach 3: Two-pass DFS (nodes first, edges second)

Pass 1: create every clone (no neighbor pointers). Pass 2: iterate original nodes and set each clone's neighbors from the map.

```python
def clone_graph(node):
    if not node:                               # L1: O(1) null guard
        return None
    old_to_new = {}                            # L2: O(1) init map
    def build_nodes(n):
        if n in old_to_new:                    # L3: O(1) skip if seen
            return
        old_to_new[n] = Node(n.val)            # L4: O(1) create clone (no neighbors yet)
        for nb in n.neighbors:
            build_nodes(nb)                    # L5: O(1) recurse, V calls total
    build_nodes(node)
    for orig, clone in old_to_new.items():
        clone.neighbors = [old_to_new[nb] for nb in orig.neighbors]  # L6: O(degree) per node
    return old_to_new[node]
```

**Where the time goes, line by line**

*Variables: V = number of nodes in the graph, E = number of edges.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3 (cache check) | O(1) | V | O(V) |
| L4 (create clone) | O(1) | V | O(V) |
| **L5 (pass 1 recursion)** | **O(1) per node** | **V** | **O(V)** |
| **L6 (pass 2 edge wiring)** | **O(degree)** | **V nodes, E edges total** | **O(E)** ← dominates for dense graphs |

Pass 1 visits every node once: O(V). Pass 2 rebuilds every neighbor list from the map: total neighbor list lengths sum to 2E (undirected), so this is O(E). The two-pass structure makes the separation of concerns explicit, at the cost of two DFS traversals instead of one.

**Complexity**
- **Time:** O(V + E) across the two passes, driven by L6 (edge wiring in pass 2).
- **Space:** O(V) for the map, plus O(V) recursion stack.

Useful when neighbor lists are built from complex state you'd rather compute once.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| **DFS + old->new map** | **O(V + E)** | **O(V)** | Canonical |
| BFS + old->new map | O(V + E) | O(V) | Avoids deep recursion |
| Two-pass node-then-edges | O(V + E) | O(V) | Clear separation |

All three are optimal in Big-O. DFS is the shortest to write.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_133.py and run.
# Uses the canonical implementation (Approach 1: DFS + hash map).

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


def _run_tests():
    # Null input
    assert clone_graph(None) is None

    # Single node, no neighbors
    n1 = Node(1)
    c1 = clone_graph(n1)
    assert c1 is not n1
    assert c1.val == 1
    assert c1.neighbors == []

    # Two nodes connected to each other: 1 -- 2
    a = Node(1)
    b = Node(2)
    a.neighbors = [b]
    b.neighbors = [a]
    ca = clone_graph(a)
    assert ca is not a
    assert ca.val == 1
    assert len(ca.neighbors) == 1
    cb = ca.neighbors[0]
    assert cb is not b
    assert cb.val == 2
    assert cb.neighbors[0] is ca  # back-pointer points to clone, not original

    # Four-node cycle: 1-2-3-4-1, each node also connected to the diagonal
    # adjacency: 1:[2,4], 2:[1,3], 3:[2,4], 4:[3,1]
    nodes = [Node(i) for i in range(1, 5)]
    nodes[0].neighbors = [nodes[1], nodes[3]]
    nodes[1].neighbors = [nodes[0], nodes[2]]
    nodes[2].neighbors = [nodes[1], nodes[3]]
    nodes[3].neighbors = [nodes[2], nodes[0]]
    root_clone = clone_graph(nodes[0])
    # Collect all cloned nodes by BFS on the clone
    from collections import deque
    visited = {}
    q = deque([root_clone])
    while q:
        cur = q.popleft()
        if cur.val in visited:
            continue
        visited[cur.val] = cur
        for nb in cur.neighbors:
            q.append(nb)
    assert set(visited.keys()) == {1, 2, 3, 4}
    # No clone should be an original node
    for orig in nodes:
        assert orig not in visited.values()

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Hash Tables](../../../data-structures/hash-tables/), old -> new node mapping
- [Queues](../../../data-structures/queues/), BFS variant
