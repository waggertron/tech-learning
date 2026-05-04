---
title: "Tarjan's algorithm"
description: "Strongly connected components of a directed graph in a single DFS pass using discovery timestamps and a low-link value that tracks the oldest ancestor reachable from each subtree."
parent: named-algorithms
tags: [algorithms, graphs, scc, dfs, directed-graphs, interviews]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it does

Given a **directed** graph, find all of its **strongly connected components** (SCCs) in a single DFS pass.

A strongly connected component is a maximal set of vertices where every vertex can reach every other vertex. "Maximal" means you can't add another vertex and preserve that property.

```
A --> B --> C
^           |
|           v
+---- D <---+
```

In this graph, `{A, B, C, D}` form one SCC: you can get from any of them to any other by following edges. If you add an isolated vertex `E` with no edges, it forms its own SCC of size 1. Every vertex belongs to exactly one SCC.

SCCs matter because they reveal the cyclic structure of a directed graph. Compressing each SCC to a single node produces a DAG (directed acyclic graph), which is a much simpler object. From there you can topologically sort, run shortest paths, or answer reachability questions efficiently.

Named after Robert Tarjan, who published the algorithm in 1972. It's one of the more elegant results in graph theory: a single DFS, one stack, and two arrays of integers are all you need.

## Core idea, in one sentence

> The **low-link value** `low[u]` is the smallest discovery time reachable from the subtree rooted at `u` via any combination of tree edges and back edges, and when `low[u] == disc[u]`, vertex `u` is the root of an SCC sitting on top of the stack.

That one condition (`low[u] == disc[u]`) is the entire SCC detection mechanism. Everything else in the algorithm is bookkeeping to compute it correctly.

## Key definitions

**Discovery time (`disc[u]`)**: a counter that increments each time DFS visits a new vertex. The first vertex visited gets `disc = 0`, the next gets `1`, and so on. This gives a total ordering of when vertices were first encountered.

**Low-link value (`low[u]`)**: the minimum discovery time reachable from the subtree rooted at `u` via any path that uses tree edges forward and at most one back edge upward. Concretely:

```
low[u] = min(
    disc[u],                        # u itself
    low[v]  for each tree-child v,  # best reachable from subtrees
    disc[w] for each back-edge u->w  # direct back edges from u
)
```

The propagation of `low` from children to parents is what makes the information flow back up the recursion.

**On-stack set**: a set tracking which vertices are currently on the explicit stack (not the call stack). When DFS finishes with a vertex, it stays on this stack until its entire SCC is popped. The on-stack check prevents `low[u]` from reaching back into a previously completed SCC.

**SCC root**: the first vertex of an SCC to be visited by DFS. It will have `low[u] == disc[u]` when DFS finishes processing it, because no back edge from its subtree reaches anything older than itself (within the same SCC).

## The code

```python
def tarjan_scc(graph: dict[int, list[int]]) -> list[list[int]]:
    """
    Find all strongly connected components of a directed graph.

    graph: adjacency list, e.g. {0: [1, 2], 1: [2], 2: [0], 3: [4], 4: []}
    Returns a list of SCCs; each SCC is a list of vertex indices.
    """
    n = max(graph) + 1
    disc = [-1] * n       # discovery time; -1 means unvisited
    low  = [0]  * n       # low-link value
    on_stack = [False] * n
    stack = []
    timer = [0]           # mutable counter (list so closure can write it)
    sccs = []

    def dfs(u: int) -> None:
        disc[u] = low[u] = timer[0]
        timer[0] += 1
        stack.append(u)
        on_stack[u] = True

        for v in graph.get(u, []):
            if disc[v] == -1:
                # tree edge: recurse, then propagate low upward
                dfs(v)
                low[u] = min(low[u], low[v])
            elif on_stack[v]:
                # back edge to ancestor still in current DFS path
                low[u] = min(low[u], disc[v])
            # if v is visited and not on_stack, it's in a completed SCC; ignore

        # check if u is the root of an SCC
        if low[u] == disc[u]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == u:
                    break
            sccs.append(scc)

    for u in range(n):
        if disc[u] == -1:
            dfs(u)

    return sccs
```

Two subtle points worth noting:

1. The `on_stack[v]` check (not `disc[v] != -1`) is what separates a back edge from a cross edge to a completed SCC. If `v` is visited but no longer on the stack, its SCC is already done, and pulling `disc[v]` into `low[u]` would be wrong: it would let information cross SCC boundaries.

2. `low[u] = min(low[u], disc[v])` for back edges, but `low[u] = min(low[u], low[v])` for tree edges. The asymmetry is intentional. From a back edge you can reach exactly `v`, so you use `disc[v]`. From a tree edge you get whatever `v`'s subtree can reach, which is `low[v]`.

## Why it works

### SCC root identification

When DFS finishes vertex `u` (after recursing into all children), `low[u]` reflects the oldest ancestor reachable from the entire subtree. If `low[u] == disc[u]`, no vertex in `u`'s subtree has a back edge to anything older than `u`. That means `u` and everything below it on the stack that was reached from `u` form a closed group: they can reach each other, but nothing in the group can escape to an older part of the graph. That's exactly the definition of an SCC.

If `low[u] < disc[u]`, some descendant has a back edge to an ancestor of `u`. Popping now would be premature: `u` is not the root, it's part of a larger SCC whose root is still higher in the DFS tree.

### Why the stack contains exactly the SCC

The stack accumulates vertices in DFS order. When we push `u` and recurse, every vertex reachable from `u` that is part of `u`'s SCC will be pushed before DFS returns to `u`. Vertices that belong to other (already completed) SCCs were already popped. So at the moment `low[u] == disc[u]` triggers, the stack contains (on top of everything older) exactly the members of `u`'s SCC. Popping until you pop `u` extracts them cleanly.

### Correctness of `on_stack` vs `visited`

Using `visited` (any visited vertex) instead of `on_stack` would be wrong. Consider:

```
A -> B -> C
          |
          v
     D -> E
     ^
     A (already completed as its own SCC)
```

If `C` has an edge to `A` and `A` is visited but not on the stack (already popped as a completed SCC), using `disc[A]` would incorrectly drag `low[C]` down to `disc[A]`, making `C` think it can reach back to `A`'s SCC. The `on_stack` check prevents this.

## Walkthrough: 6-node example

Graph edges: `0->1, 1->2, 2->0, 1->3, 3->4, 4->5, 5->3`

```
0 --> 1 --> 3 --> 4
^     |     ^     |
|     v     |     v
+--- 2       +--- 5
```

Two SCCs: `{0, 1, 2}` and `{3, 4, 5}`.

DFS from vertex 0:

| Step | Action                        | disc  | low   | stack           |
| ---- | ----------------------------- | ----- | ----- | --------------- |
| 1    | visit 0                       | 0:0   | 0:0   | [0]             |
| 2    | visit 1 (tree edge 0->1)      | 1:1   | 1:1   | [0,1]           |
| 3    | visit 2 (tree edge 1->2)      | 2:2   | 2:2   | [0,1,2]         |
| 4    | back edge 2->0 (on_stack)     | --    | 2:0   | [0,1,2]         |
| 5    | finish 2, low[2]=0 != disc[2]=2, not root | -- | -- | [0,1,2]  |
| 6    | propagate: low[1] = min(1, low[2]=0) = 0 | -- | 1:0 | [0,1,2] |
| 7    | visit 3 (tree edge 1->3)      | 3:3   | 3:3   | [0,1,2,3]       |
| 8    | visit 4 (tree edge 3->4)      | 4:4   | 4:4   | [0,1,2,3,4]     |
| 9    | visit 5 (tree edge 4->5)      | 5:5   | 5:5   | [0,1,2,3,4,5]   |
| 10   | back edge 5->3 (on_stack)     | --    | 5:3   | [0,1,2,3,4,5]   |
| 11   | finish 5, low[5]=3 != disc[5]=5, not root | -- | -- | [0,1,2,3,4,5] |
| 12   | propagate: low[4] = min(4, low[5]=3) = 3  | -- | 4:3 | [0,1,2,3,4,5] |
| 13   | finish 4, low[4]=3 != disc[4]=4, not root | -- | -- | [0,1,2,3,4,5] |
| 14   | propagate: low[3] = min(3, low[4]=3) = 3  | -- | 3:3 | [0,1,2,3,4,5] |
| 15   | finish 3: low[3]=3 == disc[3]=3, **SCC root** | -- | -- | pop 5,4,3 |
| 16   | SCC `{3,4,5}` emitted         | --    | --    | [0,1,2]         |
| 17   | propagate: low[1] = min(0, low[3]=3) = 0  | -- | 1:0 | [0,1,2]    |
| 18   | finish 1, low[1]=0 != disc[1]=1, not root | -- | -- | [0,1,2]  |
| 19   | propagate: low[0] = min(0, low[1]=0) = 0  | -- | 0:0 | [0,1,2]    |
| 20   | finish 0: low[0]=0 == disc[0]=0, **SCC root** | -- | -- | pop 2,1,0 |
| 21   | SCC `{0,1,2}` emitted         | --    | --    | []              |

Result: `[[3, 4, 5], [0, 1, 2]]`. Both SCCs correctly identified.

Note that vertex 3 is identified as an SCC root while still nested inside the recursion for vertex 1. The algorithm can emit SCCs in any order during the DFS; you don't have to wait until DFS completes.

## Complexity

| Metric | Cost | Why |
| ------ | ---- | --- |
| Time   | O(V + E) | Each vertex is visited once, each edge is examined once |
| Space  | O(V) | `disc`, `low`, `on_stack` arrays each of size V; stack holds at most V vertices |

The single DFS pass is what makes O(V + E) achievable. No graph is traversed twice.

## Application: bridges and articulation points

Tarjan also published a related algorithm (sometimes called Tarjan's bridge-finding algorithm) for **undirected** graphs. It uses the same `disc`/`low` machinery but asks a different question: which edges (bridges) or vertices (articulation points) would disconnect the graph if removed?

For undirected graphs, the low-link check becomes:

```python
# For edge u -> v (where v is a tree child of u):
# v is an articulation point if removing it disconnects a subtree
if low[v] >= disc[u]:   # v cannot reach above u without going through u
    # u is an articulation point (with a special case for u being the root)
    pass

# edge u -> v is a bridge if:
if low[v] > disc[u]:   # v's subtree cannot reach u or above
    # edge (u, v) is a bridge
    pass
```

The intuition: if `low[v] >= disc[u]`, then `v`'s entire subtree is "trapped below" `u`. Removing `u` disconnects that subtree. If `low[v] > disc[u]` (strictly greater), even the edge `u->v` itself is a bridge: no back edge exists from `v`'s subtree back to `u` or higher.

This is the same algorithm, same O(V + E), same single DFS. The only differences are: undirected graph (edges go both ways), no on-stack set needed, and the comparison operator changes.

## Application: condensation DAG

After finding all SCCs, you can **condense** the graph: replace each SCC with a single super-node, and add a directed edge between super-nodes wherever the original graph has an inter-SCC edge.

The condensation is always a DAG (directed acyclic graph). Proof: if there were a cycle in the condensation, those super-nodes would form a larger SCC, contradicting maximality.

```
Original:                    Condensation DAG:
0 --> 1 --> 3 --> 4
^     |     ^     |          [SCC-A: 0,1,2] --> [SCC-B: 3,4,5]
|     v     |     v
+--- 2       +--- 5
```

The condensation DAG is useful for:

- **2-SAT**: each boolean variable and its negation are vertices. Implications become directed edges. Tarjan finds SCCs; if a variable and its negation are in the same SCC, the formula is unsatisfiable. The condensation DAG gives a valid assignment by processing SCCs in reverse topological order.

- **Reachability queries**: can vertex A reach vertex B? Condense, then ask if `SCC(A)` can reach `SCC(B)` in the DAG. DAG reachability is much simpler (topological sort + BFS/DFS once).

- **Shortest paths with structure**: if your directed graph has cycles but you need shortest paths, compress the SCCs first. Within an SCC, all vertices are mutually reachable at zero extra cost (assuming non-negative weights). Then run Dijkstra or Bellman-Ford on the condensation.

Computing the condensation takes O(V + E) additional work after Tarjan runs: assign each vertex its SCC ID, scan all edges, add inter-SCC edges. Total remains O(V + E).

## Comparison with Kosaraju's algorithm

Kosaraju's algorithm also finds SCCs in O(V + E), but uses two DFS passes:

1. Run DFS on the original graph, recording finish times.
2. Run DFS on the **reversed** graph in decreasing finish-time order. Each DFS tree in pass 2 is one SCC.

| Property | Tarjan | Kosaraju |
| -------- | ------ | -------- |
| DFS passes | 1 | 2 |
| Memory for graph reversal | No | Yes (must build transpose) |
| Implementation complexity | Higher (low-link tracking) | Lower (two vanilla DFS runs) |
| Cache behavior | Better (single pass, better locality) | Worse (second pass traverses different memory) |
| Common in interviews | Yes (shows DFS depth) | Yes (simpler to explain conceptually) |

Which to use: Kosaraju is easier to explain to someone unfamiliar with low-link values, so it's a fine interview answer when the problem just asks "find all SCCs." Tarjan is preferred when performance matters or when you also need bridge/articulation-point detection in the same codebase (the code structures are nearly identical).

Both are correct. Neither dominates the other on all axes. Know both; reach for Tarjan when you want a single pass.

## When Tarjan is the answer

Look for these patterns in the problem statement:

**Cycle detection in directed graphs**: any directed cycle is at minimum a 2-node SCC. Tarjan finds all of them at once. If you only need to know whether *any* cycle exists, `low[u] == disc[u]` during DFS is your signal (an SCC of size > 1 means a cycle).

**Mutual reachability**: "can A reach B and B reach A?" Both are in the same SCC if and only if yes. Run Tarjan, check SCC IDs.

**Grouping by fate**: problems where "if A depends on B and B depends on A, they must be treated as a unit" map directly to SCC decomposition. Package dependency resolution is a classic example.

**2-SAT**: the standard 2-SAT reduction uses SCCs (see above). Whenever you see a problem of the form "each of N things is true or false, and implications like `A implies B` are given, is there a valid assignment?", think 2-SAT, which means think Tarjan.

**Condensation as preprocessing**: if the problem has a directed graph with cycles and asks for something on the DAG structure (longest path, shortest path, topological order), condense first, then apply the DAG algorithm.

## LeetCode: where this shows up

### Course Schedule (207 / 210)

LeetCode 207 asks whether you can finish all courses given prerequisites (cycle detection). LeetCode 210 asks for a valid course order (topological sort). Both are purely cycle detection plus topological sort on a DAG.

Tarjan technically answers these: if any SCC has size > 1, a cycle exists (207 returns false; 210 returns empty). But Tarjan is overkill here. The problems don't require knowing *which* vertices form cycles, only *whether* any exist. A plain DFS with `VISITING/VISITED` coloring, or Kahn's algorithm for topological sort, is simpler and equally fast.

Use these as conceptual bridges: the DFS structure in course-schedule solutions is the skeleton of Tarjan. Once you can trace the `disc` and `low` values through those graphs, you're ready for problems that need the full SCC decomposition.

### Problems where Tarjan is the intended solution

- **LeetCode 1192 (Critical Connections in a Network)**: find all bridges in an undirected graph. This is the bridge-finding variant of Tarjan. The `low[v] > disc[u]` condition is the answer.

- **LeetCode 1489 (Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree)**: uses bridge detection as part of the solution.

- **Graph problems with "same group" / "mutual dependency" phrasing**: if a problem gives you a directed graph and asks whether certain vertices must be processed together or are interchangeable, that's SCC decomposition.

Full SCC decomposition problems are less common on LeetCode than cycle detection problems, but they appear at Hard difficulty and in contest problems. The pattern recognition is the hard part: once you see "directed graph + mutual reachability + grouping," the code is mechanical.

## Test cases

```python
def tarjan_scc(graph: dict[int, list[int]]) -> list[list[int]]:
    n = max(graph) + 1 if graph else 0
    disc = [-1] * n
    low  = [0]  * n
    on_stack = [False] * n
    stack = []
    timer = [0]
    sccs = []

    def dfs(u: int) -> None:
        disc[u] = low[u] = timer[0]
        timer[0] += 1
        stack.append(u)
        on_stack[u] = True

        for v in graph.get(u, []):
            if disc[v] == -1:
                dfs(v)
                low[u] = min(low[u], low[v])
            elif on_stack[v]:
                low[u] = min(low[u], disc[v])

        if low[u] == disc[u]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == u:
                    break
            sccs.append(sorted(scc))

    for u in range(n):
        if disc[u] == -1:
            dfs(u)

    return sccs


def _run_tests():
    # Basic: two SCCs {0,1,2} and {3,4,5}
    g1 = {0: [1], 1: [2, 3], 2: [0], 3: [4], 4: [5], 5: [3]}
    result = tarjan_scc(g1)
    assert sorted(result) == [[0, 1, 2], [3, 4, 5]], f"got {result}"

    # Each vertex is its own SCC (DAG, no cycles)
    g2 = {0: [1], 1: [2], 2: [3], 3: []}
    result = tarjan_scc(g2)
    assert sorted(result) == [[0], [1], [2], [3]], f"got {result}"

    # All vertices in one SCC (complete cycle)
    g3 = {0: [1], 1: [2], 2: [3], 3: [0]}
    result = tarjan_scc(g3)
    assert sorted(result) == [[0, 1, 2, 3]], f"got {result}"

    # Single vertex, no edges
    g4 = {0: []}
    result = tarjan_scc(g4)
    assert sorted(result) == [[0]], f"got {result}"

    # Self-loop (vertex reachable from itself)
    g5 = {0: [0], 1: []}
    result = tarjan_scc(g5)
    assert sorted(result) == [[0], [1]], f"got {result}"

    # Two independent cycles
    g6 = {0: [1], 1: [0], 2: [3], 3: [2]}
    result = tarjan_scc(g6)
    assert sorted(result) == [[0, 1], [2, 3]], f"got {result}"

    # Complex: chain with back edge from middle
    # 0->1->2->3, 2->1 (so {1,2} is an SCC), 3->4
    g7 = {0: [1], 1: [2], 2: [3, 1], 3: [4], 4: []}
    result = tarjan_scc(g7)
    assert sorted(result) == [[0], [1, 2], [3], [4]], f"got {result}"

    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
```

## References

- Tarjan, R. E. (1972). Depth-first search and linear graph algorithms. *SIAM Journal on Computing*, 1(2), 146-160. The original paper introducing the algorithm.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., and Stein, C. (2022). *Introduction to Algorithms* (4th ed.), Chapter 22. Covers both Tarjan and Kosaraju with full correctness proofs.
- [LeetCode 1192, Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/), the canonical bridge-finding exercise built on the same DFS structure.

## Related topics

- [Depth-first search](./dfs/), the traversal that Tarjan's algorithm is built on top of
- [Kahn's algorithm](./kahns/), for topological sort of the condensation DAG you get after SCC decomposition
- [Graphs (LeetCode 150)](../leetcode-150/graphs/), cycle detection and directed graph traversal exercises
- [Advanced Graphs (LeetCode 150)](../leetcode-150/advanced-graphs/), where full SCC problems appear at Hard difficulty
