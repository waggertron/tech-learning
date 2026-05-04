---
title: "Dijkstra's algorithm"
description: "Single-source shortest paths on non-negative weighted graphs in O((V + E) log V), the canonical greedy argument for why the min-heap pop is always final, and the variants you'll meet in practice."
parent: named-algorithms
tags: [algorithms, graphs, shortest-path, greedy, interviews, heap]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it does

Given a weighted graph with non-negative edge weights and a source vertex, find the **shortest distance from the source to every reachable vertex**, in O((V + E) log V) time.

Named after Edsger W. Dijkstra, who described it in a three-page paper published in *Numerische Mathematik* in 1959. He reportedly designed it in twenty minutes without pencil or paper while sitting with his fiancée in a cafe in Amsterdam.

## The core idea, in one sentence

> The vertex you just popped from the min-heap has its shortest distance finalized: no future path through an unvisited vertex can improve it, because all edge weights are non-negative.

That invariant is the entire correctness argument. Everything else is bookkeeping.

## The code

```python
import heapq

def dijkstra(n, adj, src):
    """
    n   -- number of vertices (0-indexed)
    adj -- adjacency list: adj[u] = [(v, w), ...] for each edge u->v of weight w
    src -- source vertex

    Returns dist[], where dist[v] is the shortest distance from src to v
    (float('inf') if unreachable).
    """
    dist = [float('inf')] * n
    dist[src] = 0
    heap = [(0, src)]            # (tentative distance, vertex)

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:          # stale entry: a shorter path was already found
            continue
        for v, w in adj[u]:
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(heap, (nd, v))

    return dist
```

Four moving parts:

- `dist[v]` = best distance to `v` found so far. Starts at infinity, updated whenever a shorter path is found.
- `heap` = min-heap of `(tentative_distance, vertex)` pairs. A vertex can appear multiple times.
- The `if d > dist[u]: continue` check discards stale entries without needing a separate `visited` set.
- The relaxation `if nd < dist[v]` updates `dist[v]` and pushes the new entry only when we improve.

## Why the greedy choice is safe

This is the key question: why is it safe to declare `dist[u]` final the moment `u` is popped?

**Proof sketch:**

Suppose vertex `u` is popped with distance `d`. Assume for contradiction that there exists a shorter path: some path `src -> ... -> x -> ... -> u` with total length `< d`.

That path must pass through at least one *unvisited* vertex (otherwise `dist[u]` would already reflect it). Let `x` be the first unvisited vertex on this hypothetical shorter path.

- `dist[x] >= d` (otherwise `x` would have been popped before `u`).
- The remaining path from `x` to `u` has total weight `>= 0` (non-negative edge weights).
- So the total hypothetical distance `>= dist[x] >= d`.

Contradiction. `d` is already optimal.

The assumption that all edge weights are non-negative is load-bearing. A single negative edge breaks this argument entirely, because adding more edges could decrease the total distance.

## The lazy deletion pattern

The standard implementation pushes new entries into the heap without removing old ones. When `dist[v]` improves, the old `(old_dist, v)` entry is still sitting in the heap, now stale.

The check `if d > dist[u]: continue` handles this. When the stale entry is eventually popped, `d` is strictly greater than the current `dist[u]` (which has since been improved), so we skip it. This is called **lazy deletion**.

The alternative is an **indexed priority queue** or a Fibonacci heap, which can decrease-key in-place. In practice, lazy deletion is always used in interview code and competitive programming because:

1. Python's `heapq` has no decrease-key operation.
2. The overhead of stale entries is at most O(E log V) extra work, which doesn't change the asymptotic bound.

## Walking through an example

Graph: 5 vertices (0..4), undirected, with these edges:

```
    0
   /|
4 / | 2
 /  |
1   2
|  /|
5/ / |8
|/ /  |
3  --  4
   2
```

More precisely:

| Edge | Weight |
| ---- | ------ |
| 0-1  | 4      |
| 0-2  | 2      |
| 1-3  | 5      |
| 2-1  | 1      |
| 2-3  | 8      |
| 2-4  | 10     |
| 3-4  | 2      |

Source: 0. Run Dijkstra:

| Step | Pop      | Action                                                 | dist                       | Heap after (sorted) |
| ---- | -------- | ------------------------------------------------------ | -------------------------- | ------------------- |
| 1    | (0, 0)   | Relax: 1 via 4, 2 via 2                               | 0:0 1:4 2:2                | (2,2) (4,1)         |
| 2    | (2, 2)   | Relax: 1 via 3 (improves 4), 3 via 10, 4 via 12      | 1:3 3:10 4:12              | (3,1) (4,1)\* (10,3) (12,4) |
| 3    | (3, 1)   | Relax: 3 via 8 (improves 10)                          | 3:8                        | (4,1)\* (8,3) (10,3)\* (12,4) |
| 4    | (4, 1)\* | `4 > dist[1]=3`, skip (stale)                         |                            | (8,3) (10,3)\* (12,4) |
| 5    | (8, 3)   | Relax: 4 via 10 (improves 12)                         | 4:10                       | (10,3)\* (10,4) (12,4)\* |
| 6    | (10, 3)  | `10 > dist[3]=8`, skip (stale)                        |                            | (10,4) (12,4)\*     |
| 7    | (10, 4)  | No outgoing edges left to relax                       |                            | (12,4)\*            |
| 8    | (12, 4)  | `12 > dist[4]=10`, skip (stale)                       |                            | empty               |

Final distances from vertex 0:

| Vertex | Shortest distance | Path             |
| ------ | ----------------- | ---------------- |
| 0      | 0                 | (source)         |
| 1      | 3                 | 0 -> 2 -> 1      |
| 2      | 2                 | 0 -> 2           |
| 3      | 8                 | 0 -> 2 -> 1 -> 3 |
| 4      | 10               | 0 -> 2 -> 1 -> 3 -> 4 |

Key moment: step 2 improved the distance to vertex 1 from 4 (via direct edge 0->1) to 3 (via 0->2->1). The stale entry `(4, 1)` was discarded at step 4.

## Complexity

| Metric       | Cost with binary heap (`heapq`) | Cost with Fibonacci heap |
| ------------ | -------------------------------- | ------------------------ |
| Time         | O((V + E) log V)                 | O(E + V log V)           |
| Space        | O(V + E)                         | O(V + E)                 |
| Decrease-key | O(log V) via lazy push           | O(1) amortized           |

The Fibonacci heap is theoretically optimal but never used in practice due to high constant factors and implementation complexity. The binary heap version is the standard.

For **dense graphs** (E close to V²), a simple array-based priority queue runs in O(V²), which is better than O(E log V) = O(V² log V). When V <= 1000 and the graph is dense, the O(V²) version can outperform the heap version.

## Reconstructing the actual path

`dijkstra` as written returns distances only. To recover the path, track a `prev` array alongside `dist`:

```python
import heapq

def dijkstra_with_path(n, adj, src):
    dist = [float('inf')] * n
    prev = [-1] * n          # prev[v] = the vertex before v on the shortest path
    dist[src] = 0
    heap = [(0, src)]

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                prev[v] = u
                heapq.heappush(heap, (nd, v))

    return dist, prev

def reconstruct(prev, src, dst):
    path = []
    v = dst
    while v != -1:
        path.append(v)
        v = prev[v]
    path.reverse()
    return path if path[0] == src else []   # empty if dst unreachable
```

## Variant: multi-source Dijkstra

Sometimes the question is "shortest distance from any of several sources to each vertex" (e.g. nearest hospital, nearest exit). The trick: **push all sources into the heap at distance 0 before starting**. Dijkstra runs normally; the first time each vertex is finalized, it holds the distance to its nearest source.

```python
def dijkstra_multi_source(n, adj, sources):
    dist = [float('inf')] * n
    heap = []
    for s in sources:
        dist[s] = 0
        heapq.heappush(heap, (0, s))

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(heap, (nd, v))

    return dist
```

This runs in the same O((V + E) log V) as single-source. [LeetCode 994 (Rotting Oranges)](../leetcode-150/graphs/994-rotting-oranges/) is essentially a multi-source BFS, which is the unweighted version of this.

## Variant: maximum probability / minimum bottleneck path

Dijkstra isn't limited to sum of weights. Any monotone combination where "taking more steps can only make things worse" admits a Dijkstra-style solution.

**Maximum probability path (LeetCode 1514):** edges have probabilities. You want to maximize the product of probabilities along the path. Swap `<` for `>`, initialize with 0.0 everywhere and 1.0 at source, and use a max-heap (`heapq` negates for max):

```python
def max_prob_path(n, edges, probs, src, dst):
    adj = [[] for _ in range(n)]
    for i, (u, v) in enumerate(edges):
        adj[u].append((v, probs[i]))
        adj[v].append((u, probs[i]))

    prob = [0.0] * n
    prob[src] = 1.0
    heap = [(-1.0, src)]          # max-heap via negation

    while heap:
        p, u = heapq.heappop(heap)
        p = -p
        if p < prob[u]:
            continue
        for v, pw in adj[u]:
            np_ = prob[u] * pw
            if np_ > prob[v]:
                prob[v] = np_
                heapq.heappush(heap, (-np_, v))

    return prob[dst]
```

The pattern is identical to standard Dijkstra. Only the comparison direction and the combination function change.

## What goes wrong with negative weights

With even one negative edge, the greedy invariant breaks.

Counter-example: vertices 0, 1, 2. Edges: 0->1 (5), 0->2 (3), 2->1 (-10).

Dijkstra pops 0 first, pushes dist[2]=3 and dist[1]=5. Then pops vertex 2 (dist 3), updates dist[1] to 3 + (-10) = -7. That's correct, but only by luck. In a larger graph, Dijkstra might have already finalized vertex 1 at distance 5 before processing vertex 2. Once finalized, the algorithm doesn't revisit it.

For graphs with negative edges but no negative cycles, use **Bellman-Ford** (O(VE)). For negative cycles (undefined shortest path), Bellman-Ford detects them.

## The relationship to A\*

A\* is Dijkstra with a **heuristic**: instead of ordering by `dist[u]` alone, it orders by `dist[u] + h(u)`, where `h(u)` is an estimate of the remaining distance to the target. With a consistent (non-overestimating) heuristic, A\* is correct and often faster than Dijkstra because it explores fewer vertices.

Dijkstra is A\* with `h(u) = 0` for all vertices.

## When it's the answer

Dijkstra appears whenever the problem has:

- A graph (or something reducible to a graph: grids, state machines).
- Non-negative edge costs (distances, times, probabilities, costs).
- A "shortest / cheapest / fastest" query from one or more fixed starting points.

The canonical pattern: build an adjacency list, run Dijkstra, return `dist[target]` or `-1` if `dist[target] == inf`.

On grids specifically, edges are implicit (four or eight neighbors), edge weight is often the cell value at the destination, and Dijkstra replaces BFS whenever weights aren't uniform.

## Things that aren't Dijkstra (counter-clues)

- **All weights equal to 1** -> use BFS (O(V + E), no heap needed).
- **Negative edge weights** -> Bellman-Ford or SPFA.
- **Shortest path between all pairs** -> Floyd-Warshall (O(V³)).
- **Maximum flow** -> different problem entirely; Ford-Fulkerson or Dinic's.
- **Minimum spanning tree** -> Prim's (same greedy structure, but picks minimum edge to the tree, not shortest path from source).
- **The graph has a DAG structure** -> relax edges in topological order, O(V + E), no heap.

## LeetCode exercises

| Problem | What makes it Dijkstra | Key detail |
| ------- | ---------------------- | ---------- |
| [743 Network Delay Time](../leetcode-150/advanced-graphs/743-network-delay-time/) | Directed weighted graph, single source to all vertices | Answer is `max(dist)`, or -1 if any vertex unreachable |
| [787 Cheapest Flights Within K Stops](../leetcode-150/advanced-graphs/787-cheapest-flights-within-k-stops/) | Shortest path with a stop-count constraint | State is `(cost, node, stops_remaining)`; modified Dijkstra or Bellman-Ford |
| [778 Swim in Rising Water](../leetcode-150/advanced-graphs/778-swim-in-rising-water/) | Grid, edge weight = max of two cell values | Minimum bottleneck path; Dijkstra on implicit grid graph |
| [1584 Min Cost to Connect All Points](../leetcode-150/advanced-graphs/1584-min-cost-to-connect-all-points/) | Minimum spanning tree (Prim's), not shortest path | Same heap structure as Dijkstra but picks cheapest new edge, not shortest path |

## Test cases

```python
import heapq

def dijkstra(n, adj, src):
    dist = [float('inf')] * n
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return dist

def _make_adj(n, edges, directed=False):
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))
        if not directed:
            adj[v].append((u, w))
    return adj

def _run_tests():
    # Basic undirected example from the walkthrough above
    edges = [(0,1,4),(0,2,2),(1,3,5),(2,1,1),(2,3,8),(2,4,10),(3,4,2)]
    adj = _make_adj(5, edges, directed=False)
    d = dijkstra(5, adj, 0)
    assert d[0] == 0
    assert d[1] == 3   # 0->2->1
    assert d[2] == 2   # 0->2
    assert d[3] == 8   # 0->2->1->3
    assert d[4] == 10  # 0->2->1->3->4

    # Single-node graph
    d = dijkstra(1, [[]], 0)
    assert d[0] == 0

    # Disconnected vertex
    adj2 = _make_adj(4, [(0,1,5),(1,2,3)], directed=False)
    d = dijkstra(4, adj2, 0)
    assert d[3] == float('inf')

    # Direct edge vs indirect: indirect wins
    adj3 = _make_adj(3, [(0,1,10),(0,2,1),(2,1,1)], directed=False)
    d = dijkstra(3, adj3, 0)
    assert d[1] == 2   # 0->2->1, not 0->1 (cost 10)

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
```

## References

- Dijkstra, E.W. (1959). "A note on two problems in connexion with graphs." *Numerische Mathematik* 1: 269-271. The original paper.
- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms* (CLRS), Chapter 24. The definitive textbook treatment including Fibonacci heap analysis.
- [CP-Algorithms: Dijkstra's algorithm](https://cp-algorithms.com/graph/dijkstra.html), practical implementation notes with the sparse-graph optimization.
- [Network Routing: OSPF](https://en.wikipedia.org/wiki/Open_Shortest_Path_First), real-world use of Dijkstra in internet routing protocols.

## Related topics

- [Kadane's algorithm](./kadane/), another named greedy algorithm worth knowing by shape
- [LeetCode 743, Network Delay Time](../leetcode-150/advanced-graphs/743-network-delay-time/), the direct Dijkstra exercise
- [LeetCode 778, Swim in Rising Water](../leetcode-150/advanced-graphs/778-swim-in-rising-water/), Dijkstra on an implicit grid
- [LeetCode 787, Cheapest Flights Within K Stops](../leetcode-150/advanced-graphs/787-cheapest-flights-within-k-stops/), Dijkstra with a state constraint
- [Advanced Graphs](../leetcode-150/advanced-graphs/), the problem category where Dijkstra shows up most
- [Common algorithms cheat sheet](../../../posts/2026-04-27-common-algorithms-cheat-sheet/), quick reference card
