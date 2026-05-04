---
title: "Bellman-Ford algorithm"
description: "Single-source shortest paths that handle negative edge weights by relaxing all edges V-1 times, plus negative-cycle detection on the V-th pass."
parent: named-algorithms
tags: [algorithms, graphs, shortest-path, dynamic-programming, negative-weights, interviews]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it does (and what it handles that Dijkstra can't)

Given a weighted directed graph and a source vertex, find the **shortest distance from the source to every reachable vertex**, even when edge weights are negative.

Named after Richard Bellman and Lester Ford Jr., who published independent descriptions of the algorithm in 1958 and 1956 respectively. Bellman framed it as a dynamic programming recurrence; Ford framed it as a relaxation procedure. Both framings are correct and instructive.

The key difference from Dijkstra: **Dijkstra's greedy invariant requires non-negative edge weights**. The moment you introduce a negative edge, the invariant breaks: a path that looks suboptimal now might become optimal after traversing a negative edge later. Bellman-Ford handles this by abandoning the greedy approach entirely. Instead of finalizing one vertex per step, it relaxes every edge, repeatedly, until no further improvement is possible.

It also does something Dijkstra cannot: **detect negative cycles**. A negative cycle is a cycle whose total edge weight is negative. If one is reachable from the source, there is no well-defined shortest path (you can loop forever, decreasing the distance without bound). Bellman-Ford detects this condition explicitly.

## The core idea, in one sentence

> Relax every edge V-1 times: a shortest path in a V-node graph visits at most V-1 edges (assuming no negative cycles), so V-1 relaxation passes are always enough to propagate the optimal distance from source to every vertex.

That sentence is the whole algorithm. Everything else is consequence.

## The code

```python
def bellman_ford(n, edges, src):
    """
    n     -- number of vertices (0-indexed)
    edges -- list of (u, v, w) directed edges
    src   -- source vertex

    Returns (dist, has_negative_cycle) where:
      dist[v] is the shortest distance from src to v (float('inf') if unreachable)
      has_negative_cycle is True if a negative cycle is reachable from src
    """
    dist = [float('inf')] * n
    dist[src] = 0

    # V-1 relaxation passes
    for _ in range(n - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break   # early exit: no improvement means we're done

    # V-th pass: negative cycle detection
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return dist, True   # something still relaxes: negative cycle exists

    return dist, False
```

Four moving parts:

- `dist[v]` = best distance to `v` found so far. Starts at infinity, `0` at source.
- The outer loop runs at most `n-1` times (one pass = one "hop" propagated from source).
- The early exit (`if not updated: break`) is optional but important in practice: many real graphs converge in far fewer than V-1 passes.
- The V-th pass runs over all edges one more time. If anything still relaxes, a negative cycle must exist.

## Why V-1 passes is enough

The argument is a clean induction on path length.

**Claim:** after `k` passes of Bellman-Ford, `dist[v]` holds the correct shortest path distance using **at most `k` edges**.

**Base case (k=0):** `dist[src] = 0` and `dist[v] = inf` for all others. This is exactly right: a path using zero edges from source reaches only source.

**Inductive step:** Suppose after pass `k`, every vertex reachable by a k-edge path has its correct shortest k-edge distance. In pass `k+1`, for every edge `(u, v, w)`, we try `dist[u] + w`. Since `dist[u]` already reflects the best k-edge path to `u`, this computes the best `(k+1)`-edge path to `v` that routes through `u`. Over all edges, the minimum across all such candidates is the best `(k+1)`-edge path to `v`. So after pass `k+1`, every vertex with a `(k+1)`-edge shortest path has the correct distance.

**Conclusion:** in a V-vertex graph with no negative cycles, every simple path has at most `V-1` edges (because a simple path visits each vertex at most once). After `V-1` passes, every vertex has the shortest-simple-path distance. Done.

The assumption "no negative cycles" is load-bearing. If a negative cycle exists, there is no finite shortest path: you can always go around the cycle one more time and improve the distance. In that case the algorithm's distances are meaningless, but the V-th pass detects the situation.

## Why the V-th pass detects negative cycles

After `V-1` passes, if there are no negative cycles, `dist[v]` is optimal for every vertex. That means no edge `(u, v, w)` can reduce `dist[v]` further: `dist[u] + w >= dist[v]` for all edges.

If any edge still satisfies `dist[u] + w < dist[v]`, then `dist[v]` is not yet optimal, which means the shortest "path" to `v` requires more than `V-1` edges. The only way that happens is if the path loops through a negative cycle. Therefore: **if a V-th pass relaxes anything, a negative cycle is reachable from source**.

Note the subtlety: we only run the relaxation if `dist[u] != inf`. An edge from an unreachable vertex cannot propagate a negative cycle.

## Concrete walkthrough

Graph: 5 vertices (0..4), with these directed edges:

```
  0 ---(4)---> 1
  |            |
 (2)          (-6)
  |            |
  v            v
  2 ---(3)---> 3
               |
              (1)
               v
               4
```

Edge list:

| Edge (u -> v) | Weight |
| ------------- | ------ |
| 0 -> 1        | 4      |
| 0 -> 2        | 2      |
| 1 -> 3        | -6     |
| 2 -> 3        | 3      |
| 3 -> 4        | 1      |

Source: 0. Initial `dist = [0, inf, inf, inf, inf]`.

**Pass 1** (propagates 1 hop from source):

- Edge 0->1, w=4: `dist[0]+4=4 < inf` -> `dist[1] = 4`
- Edge 0->2, w=2: `dist[0]+2=2 < inf` -> `dist[2] = 2`
- Edge 1->3, w=-6: `dist[1]+(-6)=-2 < inf` -> `dist[3] = -2`
- Edge 2->3, w=3: `dist[2]+3=5 > -2` -> no change
- Edge 3->4, w=1: `dist[3]+1=-1 < inf` -> `dist[4] = -1`

After pass 1: `dist = [0, 4, 2, -2, -1]`

**Pass 2** (propagates 2 hops from source):

- Edge 0->1, w=4: `0+4=4 = dist[1]` -> no change
- Edge 0->2, w=2: `0+2=2 = dist[2]` -> no change
- Edge 1->3, w=-6: `4-6=-2 = dist[3]` -> no change
- Edge 2->3, w=3: `2+3=5 > -2` -> no change
- Edge 3->4, w=1: `-2+1=-1 = dist[4]` -> no change

After pass 2: `dist = [0, 4, 2, -2, -1]` (no changes)

Early exit fires. The algorithm terminates after 2 passes, not 4.

**V-th pass (negative cycle check):** no edge relaxes. Result: `(dist=[0,4,2,-2,-1], has_negative_cycle=False)`.

Final shortest distances from vertex 0:

| Vertex | Distance | Path              |
| ------ | -------- | ----------------- |
| 0      | 0        | (source)          |
| 1      | 4        | 0 -> 1            |
| 2      | 2        | 0 -> 2            |
| 3      | -2       | 0 -> 1 -> 3       |
| 4      | -1       | 0 -> 1 -> 3 -> 4  |

Key moment: vertex 3 reaches distance -2, via the negative edge 1->3. Dijkstra would have finalized vertex 3 at distance 5 (via 0->2->3) before processing vertex 1's negative edge, and would never have corrected it.

## Complexity

| Metric | Bellman-Ford | Dijkstra (binary heap) |
| ------ | ------------ | ---------------------- |
| Time   | O(V \* E)    | O((V + E) log V)       |
| Space  | O(V)         | O(V + E)               |
| Handles negative weights | Yes | No |
| Detects negative cycles  | Yes | No |

For a sparse graph (E close to V): Dijkstra is O(V log V), Bellman-Ford is O(V^2). Dijkstra wins badly.

For a dense graph (E close to V^2): Dijkstra is O(V^2 log V), Bellman-Ford is O(V^3). Dijkstra still wins on dense graphs with no negative weights.

Bellman-Ford's only advantages are correctness on negative-weight graphs and cycle detection. When neither applies, use Dijkstra.

## SPFA: the Shortest Path Faster Algorithm

The standard implementation loops over all edges every pass, even edges whose source vertex `dist[u]` hasn't changed. SPFA (Shortest Path Faster Algorithm, sometimes called "Bellman-Ford with a queue") fixes this by only re-processing vertices whose distance recently improved.

```python
from collections import deque

def spfa(n, edges, src):
    """
    Same signature as bellman_ford.
    Average O(E), worst case O(V * E).
    """
    # Build adjacency list for O(1) neighbor access
    adj = [[] for _ in range(n)]
    for u, v, w in edges:
        adj[u].append((v, w))

    dist = [float('inf')] * n
    dist[src] = 0
    in_queue = [False] * n
    count = [0] * n        # how many times each vertex has been enqueued

    queue = deque([src])
    in_queue[src] = True
    count[src] = 1

    while queue:
        u = queue.popleft()
        in_queue[u] = False

        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
                    count[v] += 1
                    if count[v] > n:
                        return dist, True   # negative cycle

    return dist, False
```

Key differences from standard Bellman-Ford:

- Only processes a vertex when its distance improved (via the queue).
- `count[v]` tracks how many times vertex `v` has been enqueued. If it exceeds `n`, vertex `v` has been relaxed more than `V` times, which is only possible with a negative cycle.
- Average-case performance on real-world graphs is close to O(E), making it competitive with Dijkstra in practice. But the worst case (a carefully constructed adversarial graph) is still O(V \* E), same as standard Bellman-Ford.

SPFA is the algorithm to reach for when:
- You expect negative weights but not negative cycles.
- The graph is sparse and average-case performance matters.
- You want to combine the generality of Bellman-Ford with speed closer to Dijkstra.

Use standard Bellman-Ford when you need simple, predictable O(V \* E) behavior or when you're implementing the K-stops variant (see below).

## Application: [LeetCode 787](../leetcode-150/advanced-graphs/787-cheapest-flights-within-k-stops/), Cheapest Flights Within K Stops

[LeetCode 787](../leetcode-150/advanced-graphs/787-cheapest-flights-within-k-stops/) asks: given a directed weighted graph of flights (source, destination, price), find the cheapest path from `src` to `dst` using **at most K stops** (K+1 edges).

Dijkstra handles this with state `(cost, node, stops_remaining)`, but the Bellman-Ford framing is cleaner and more instructive: **run exactly K+1 passes of Bellman-Ford** (not V-1), because K stops means K+1 edges means K+1 relaxation passes.

The critical twist: within a single pass, you must not use updates made in the same pass. If you update `dist[v]` during pass `i` and then immediately use it to update `dist[w]` in the same pass `i`, you've effectively found a path using more than i edges in a single pass. This violates the "at most K+1 edges" constraint.

The fix: **copy `dist` at the start of each pass** and read from the copy, write to the live array.

```python
def find_cheapest_price(n, flights, src, dst, k):
    """
    n       -- number of cities (0-indexed)
    flights -- list of (from, to, price)
    src     -- source city
    dst     -- destination city
    k       -- maximum number of stops (k stops = k+1 edges)

    Returns the cheapest price, or -1 if no path exists within k stops.
    """
    dist = [float('inf')] * n
    dist[src] = 0

    for _ in range(k + 1):           # exactly k+1 passes = k stops
        temp = dist[:]               # snapshot: read from here, write to dist
        for u, v, w in flights:
            if temp[u] != float('inf') and temp[u] + w < dist[v]:
                dist[v] = temp[u] + w

    return dist[dst] if dist[dst] != float('inf') else -1
```

Why `temp = dist[:]` matters: without it, a single pass could chain multiple edges, effectively allowing more than `k` stops. The snapshot enforces the constraint that each pass extends paths by exactly one edge.

This is the standard Bellman-Ford pattern for "shortest path with at most K edges." The number of passes is the budget, not V-1.

## When to use Bellman-Ford vs Dijkstra

| Condition | Use |
| --------- | --- |
| No negative edge weights | Dijkstra (faster by O(log V) per vertex) |
| Negative edges, no negative cycles | Bellman-Ford or SPFA |
| Need to detect negative cycles | Bellman-Ford |
| Stop count constraint (at most K edges) | Bellman-Ford (K passes with snapshot) |
| Sparse graph, no negatives | Dijkstra strongly preferred |
| Dense graph, no negatives | Either (Dijkstra still usually wins) |
| Dense graph with negatives | Bellman-Ford (O(V^3) vs nothing correct) |

The presence of negative weights is the deciding factor. When they're absent, Dijkstra is always preferable. When they're present, Bellman-Ford is usually the only correct option.

## When to use Bellman-Ford vs Floyd-Warshall

Both handle negative weights. The distinction is scope:

| Question | Algorithm |
| -------- | --------- |
| Shortest paths from one source to all vertices | Bellman-Ford: O(V \* E) |
| Shortest paths between all pairs of vertices | Floyd-Warshall: O(V^3) |
| Negative cycle detection (from one source) | Bellman-Ford V-th pass |
| Negative cycle detection (anywhere in graph) | Floyd-Warshall diagonal check |

If the problem fixes a source and asks "distance to all vertices" or "can I reach X from Y," Bellman-Ford is the right level of scope. Floyd-Warshall's O(V^3) is unnecessary overhead when you only need single-source distances.

Floyd-Warshall becomes the right tool when the problem asks about all pairs simultaneously, or when the graph is small enough that O(V^3) is acceptable and the simplicity of three nested loops is worth it.

## Counter-clues: when Bellman-Ford is overkill

- **No negative edges in the problem.** If the problem guarantees non-negative weights (distances, costs, probabilities), Dijkstra is strictly better. Never reach for Bellman-Ford just because you know it works: it works on all cases Dijkstra handles, but at higher cost.
- **All weights equal to 1.** Use BFS. O(V + E), no edge list iteration needed.
- **Unweighted graph.** BFS gives shortest hop count in O(V + E).
- **All-pairs shortest path on a small graph.** Floyd-Warshall in three lines of nested loops is simpler.
- **DAG (directed acyclic graph) with mixed weights.** Topological sort + single-pass relaxation is O(V + E) and handles negative edges correctly because there are no cycles to worry about.

The pattern: Bellman-Ford's O(V \* E) is only worth paying when (a) negative weights are present and (b) you need single-source distances. In every other case, a cheaper algorithm applies.

## LeetCode exercises

| Problem | Notes |
| ------- | ----- |
| [787 Cheapest Flights Within K Stops](../leetcode-150/advanced-graphs/787-cheapest-flights-within-k-stops/) | The canonical Bellman-Ford exercise: K+1 passes with snapshot copy |
| [743 Network Delay Time](../leetcode-150/advanced-graphs/743-network-delay-time/) | Easier with Dijkstra (no negative weights), but solvable with Bellman-Ford as practice |

Note on 743: all edge weights are positive. Dijkstra runs in O((V + E) log V) and is the intended solution. Bellman-Ford gives the correct answer at O(V \* E) cost. Use 743 for Dijkstra practice; use 787 for Bellman-Ford practice.

## Test cases

```python
def bellman_ford(n, edges, src):
    dist = [float('inf')] * n
    dist[src] = 0
    for _ in range(n - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return dist, True
    return dist, False

def find_cheapest_price(n, flights, src, dst, k):
    dist = [float('inf')] * n
    dist[src] = 0
    for _ in range(k + 1):
        temp = dist[:]
        for u, v, w in flights:
            if temp[u] != float('inf') and temp[u] + w < dist[v]:
                dist[v] = temp[u] + w
    return dist[dst] if dist[dst] != float('inf') else -1

def _run_tests():
    # Walkthrough graph from this article
    edges = [(0,1,4),(0,2,2),(1,3,-6),(2,3,3),(3,4,1)]
    d, neg = bellman_ford(5, edges, 0)
    assert not neg
    assert d[0] == 0
    assert d[1] == 4
    assert d[2] == 2
    assert d[3] == -2   # via 0->1->3 with negative edge
    assert d[4] == -1

    # Negative cycle: 0->1->2->0 with total weight -1
    cycle_edges = [(0,1,1),(1,2,1),(2,0,-3),(0,3,5)]
    d2, neg2 = bellman_ford(4, cycle_edges, 0)
    assert neg2

    # Unreachable vertex
    edges3 = [(0,1,2),(1,2,3)]
    d3, neg3 = bellman_ford(5, edges3, 0)
    assert not neg3
    assert d3[3] == float('inf')
    assert d3[4] == float('inf')

    # Single vertex
    d4, neg4 = bellman_ford(1, [], 0)
    assert not neg4
    assert d4[0] == 0

    # LC 787: cheapest flights with at most 1 stop
    flights = [(0,1,100),(1,2,100),(0,2,500)]
    assert find_cheapest_price(3, flights, 0, 2, 1) == 200   # 0->1->2
    assert find_cheapest_price(3, flights, 0, 2, 0) == 500   # direct only
    assert find_cheapest_price(3, flights, 0, 1, 0) == 100

    # LC 787: no path within stop limit
    flights2 = [(0,1,100),(1,2,100),(2,3,100)]
    assert find_cheapest_price(4, flights2, 0, 3, 1) == -1   # need 2 stops, only 1 allowed
    assert find_cheapest_price(4, flights2, 0, 3, 2) == 300

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## References

- Bellman, R. (1958). "On a routing problem." *Quarterly of Applied Mathematics* 16(1): 87-90. The dynamic programming formulation.
- Ford, L.R. Jr. (1956). "Network Flow Theory." RAND Corporation Paper P-923. The relaxation formulation, predating Bellman's paper by two years.
- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms* (CLRS), Chapter 24. Definitive textbook treatment with full correctness proofs.
- [CP-Algorithms: Bellman-Ford](https://cp-algorithms.com/graph/bellman_ford.html). Practical implementation notes including SPFA and path reconstruction.

## Related topics

- [Dijkstra's algorithm](./dijkstra/), the faster single-source algorithm for non-negative weights
- [BFS](./bfs/), the O(V + E) shortest-path algorithm for unweighted graphs
- [Advanced Graphs](../leetcode-150/advanced-graphs/), the problem category where both Dijkstra and Bellman-Ford appear
