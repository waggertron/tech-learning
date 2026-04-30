---
title: Common algorithms cheat sheet, Dijkstra, Kahn, Kruskal, and the rest
date: 2026-04-27
description: "Dijkstra's shortest path, Kahn's and DFS topological sort, Kruskal's and Prim's MST, Bellman-Ford, Floyd-Warshall, Tarjan's SCC, A*, Floyd's tortoise-and-hare, KMP, quickselect, and Union-Find. The mental model, when to pick each, and the gotchas."
tags: [algorithms, graphs, shortest-path, mst, topological-sort, interview-prep, reference]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-27-common-algorithms-cheat-sheet/
---

## What's in here

Most interviews and most real systems pull from a small set of named algorithms. This is the reference for that set: what each one does, when to pick it, the canonical implementation, and the failure modes. Sister post: [Data structure complexity cheat sheet](../2026-04-27-data-structure-complexity-cheat-sheet/).

Each algorithm has the same shape: **what, when, how, complexity, gotchas.**

---

## Dijkstra's shortest path

**What:** shortest path from a source to all other nodes in a weighted graph with **non-negative** edge weights.

**When:** GPS routing, network latency, "minimum cost to reach X." If weights can be negative, use Bellman-Ford.

**How:** maintain a min-heap keyed on tentative distance. Pop the closest unvisited node, relax its edges, repeat.

```python
import heapq

def dijkstra(graph, source):
    # graph: dict of {node: [(neighbor, weight), ...]}
    dist = {source: 0}
    heap = [(0, source)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:           # stale entry, skip
            continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist.get(v, float('inf')):
                dist[v] = nd
                heapq.heappush(heap, (nd, v))
    return dist
```

**Complexity:** O((V + E) log V) time, O(V) space.

**Gotchas:**

- **Negative weights break it.** Dijkstra assumes once you pop a node, you've found its final distance. A negative edge could have given you a shorter path through an unvisited node. Use Bellman-Ford instead.
- **The "stale entry" check matters.** When you find a shorter path to `v`, you push a new `(nd, v)` rather than updating the existing one (Python's heap doesn't support decrease-key cheaply). The check `if d > dist[u]: continue` discards the older, longer entries.
- **Dense graphs:** if V² ≈ E, an array-based priority queue gives O(V²) which beats O(E log V) for dense input.

---

## Bellman-Ford

**What:** shortest path from a source, like Dijkstra, but **handles negative weights** and **detects negative cycles**.

**When:** currency arbitrage, networks with credit/debit edges, anything where edges can be negative.

**How:** relax every edge V - 1 times. After V - 1 rounds, distances are final. If a Vth round changes anything, there's a negative cycle.

```python
def bellman_ford(edges, V, source):
    # edges: list of (u, v, weight)
    dist = [float('inf')] * V
    dist[source] = 0
    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    # Detect negative cycle
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            raise ValueError("negative cycle detected")
    return dist
```

**Complexity:** O(V · E) time, O(V) space.

**Gotchas:**

- Slower than Dijkstra by a factor of `V / log V`. Only reach for it when negative weights actually exist.
- The Vth-round detection is the key feature. If you don't need cycle detection, use SPFA or just Dijkstra (if weights are non-negative).

---

## Floyd-Warshall (all-pairs shortest paths)

**What:** shortest path between **every pair** of nodes.

**When:** small dense graphs (V ≤ ~500); transitive closure problems; graph diameter.

**How:** triple loop, considering each node as a possible intermediate.

```python
def floyd_warshall(W, V):
    # W: V×V matrix of edge weights, inf where no edge
    dist = [row[:] for row in W]
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist
```

**Complexity:** O(V³) time, O(V²) space.

**Gotchas:**

- The loop order matters. `k` (intermediate) must be the **outer** loop. Swapping it with `i` or `j` produces wrong answers.
- O(V³) is fine for V ≤ 500. Past that, run Dijkstra V times (O(V · (V+E) log V)) and beat Floyd-Warshall on sparse graphs.

---

## Topological sort (Kahn's algorithm)

**What:** linear ordering of nodes in a DAG such that for every edge `u → v`, `u` comes before `v`.

**When:** task scheduling with dependencies, build systems, course prerequisites, anything with "must happen before."

**How:** repeatedly remove nodes with **in-degree 0**, decrementing the in-degree of their neighbors as you go.

```python
from collections import deque

def topo_sort_kahn(graph, V):
    in_degree = [0] * V
    for u in range(V):
        for v in graph[u]:
            in_degree[v] += 1

    q = deque(u for u in range(V) if in_degree[u] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)

    if len(order) != V:
        raise ValueError("cycle detected")  # not a DAG
    return order
```

**Complexity:** O(V + E) time, O(V) space.

**Gotchas:**

- **Cycle detection is built in.** If your output has fewer than V nodes, the remaining nodes form a cycle (no node has in-degree 0). This is the cleanest way to validate a DAG.
- Order isn't unique. Different starting nodes (or BFS vs priority queue) give different valid orderings. If you need lexicographic order, swap `deque` for a min-heap.

---

## Topological sort (DFS variant)

**What:** same output as Kahn's, but produced by post-order DFS in reverse.

**When:** when you also want strongly-connected component info, or when DFS feels more natural for the problem.

**How:** DFS each unvisited node. When DFS returns from a node, prepend it to the result.

```python
def topo_sort_dfs(graph, V):
    visited = [False] * V
    on_stack = [False] * V       # for cycle detection
    order = []

    def dfs(u):
        visited[u] = True
        on_stack[u] = True
        for v in graph[u]:
            if on_stack[v]:
                raise ValueError("cycle detected")
            if not visited[v]:
                dfs(v)
        on_stack[u] = False
        order.append(u)

    for u in range(V):
        if not visited[u]:
            dfs(u)
    return order[::-1]
```

**Complexity:** O(V + E) time, O(V) space (recursion stack).

**Gotchas:**

- The `on_stack` array (gray nodes in tri-color DFS) detects back edges, which mark cycles. A simple `visited` array isn't enough.
- The reverse-postorder produces the topological order. Don't forget the reverse.

---

## Kruskal's minimum spanning tree

**What:** the spanning tree of an undirected weighted graph with minimum total edge weight.

**When:** network design, clustering, any "connect all nodes cheaply."

**How:** sort edges by weight, then greedily add each edge if it doesn't form a cycle (using Union-Find).

```python
def kruskal(edges, V):
    # edges: list of (weight, u, v)
    edges.sort()
    parent = list(range(V))
    rank = [0] * V

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]   # path compression
            x = parent[x]
        return x

    def union(x, y):
        rx, ry = find(x), find(y)
        if rx == ry: return False
        if rank[rx] < rank[ry]: rx, ry = ry, rx
        parent[ry] = rx
        if rank[rx] == rank[ry]: rank[rx] += 1
        return True

    mst = []
    for w, u, v in edges:
        if union(u, v):
            mst.append((u, v, w))
            if len(mst) == V - 1:
                break
    return mst
```

**Complexity:** O(E log E) time (the sort), O(V) space (Union-Find).

**Gotchas:**

- Sort dominates. Path compression + union by rank makes Union-Find effectively O(1), so the sort is the bottleneck.
- Stops early once you have V - 1 edges. A spanning tree has exactly that many.

---

## Prim's minimum spanning tree

**What:** same output as Kruskal's. Different algorithm.

**When:** dense graphs (favors adjacency-matrix representation), or when you want to grow the MST from a starting node.

**How:** start with one node. Repeatedly add the cheapest edge connecting the tree to a node outside it.

```python
import heapq

def prim(graph, V):
    # graph: adjacency list of {u: [(v, weight), ...]}
    visited = [False] * V
    heap = [(0, 0)]   # (weight, node) starting from node 0
    total = 0
    edges_added = 0
    while heap and edges_added < V:
        w, u = heapq.heappop(heap)
        if visited[u]: continue
        visited[u] = True
        total += w
        edges_added += 1
        for v, vw in graph[u]:
            if not visited[v]:
                heapq.heappush(heap, (vw, v))
    return total
```

**Complexity:** O((V + E) log V) time with a heap, O(V²) with an adjacency matrix and array-based priority queue.

**Gotchas:**

- Prim is to Kruskal as Dijkstra is to Bellman-Ford: the heap-based growing-frontier algorithm vs the global-edge-relaxation algorithm.
- For dense graphs, the V² array-based variant beats the O(E log V) heap variant.

---

## Union-Find (Disjoint Set Union)

**What:** maintain a partition of n elements into disjoint sets. Two operations: `union(a, b)` merges two sets; `find(a)` returns the set's representative.

**When:** Kruskal's MST, connected components, dynamic connectivity, "are these two things in the same group?"

**How:** each set is a tree. `find` walks to the root; `union` links one root under another.

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]   # path compression
            x = self.parent[x]
        return x

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry: return False
        if self.rank[rx] < self.rank[ry]: rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]: self.rank[rx] += 1
        self.components -= 1
        return True
```

**Complexity:** O(α(n)) amortized per operation. α is the inverse Ackermann function -- effectively constant.

**Gotchas:**

- **Both** path compression and union by rank are required for the α(n) bound. Either alone gives you O(log n).
- The `components` counter (decremented on every successful union) is a free side-channel for "how many connected components do I have?"

---

## Tarjan's strongly connected components

**What:** find all SCCs in a directed graph. An SCC is a maximal set of nodes where every node can reach every other.

**When:** dependency cycles, condensing a graph into a DAG, "what nodes can reach what."

**How:** single DFS pass tracking discovery times and low-link values. Pop SCCs off a stack as you find them.

```python
def tarjan_scc(graph, V):
    index_counter = [0]
    stack = []
    lowlink = [0] * V
    index = [0] * V
    on_stack = [False] * V
    visited = [False] * V
    sccs = []

    def strongconnect(v):
        index[v] = index_counter[0]
        lowlink[v] = index_counter[0]
        index_counter[0] += 1
        stack.append(v)
        on_stack[v] = True
        visited[v] = True

        for w in graph[v]:
            if not visited[w]:
                strongconnect(w)
                lowlink[v] = min(lowlink[v], lowlink[w])
            elif on_stack[w]:
                lowlink[v] = min(lowlink[v], index[w])

        if lowlink[v] == index[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v: break
            sccs.append(scc)

    for v in range(V):
        if not visited[v]:
            strongconnect(v)
    return sccs
```

**Complexity:** O(V + E) time, O(V) space.

**Gotchas:**

- The `lowlink == index` check is what defines an SCC root. When DFS returns to a node whose lowlink equals its discovery index, everything still on the stack from that point down is one SCC.
- Kosaraju's algorithm gets the same result with two DFS passes; pick whichever you find easier to recall.

---

## A* search

**What:** Dijkstra's, but guided by a heuristic. Finds shortest path faster on average when you have a good estimate of remaining distance.

**When:** pathfinding in games, robotics; whenever you can cheaply estimate distance to the goal.

**How:** Dijkstra-like, but the priority queue is keyed on `g(n) + h(n)`, where `g` is cost so far and `h` is the heuristic estimate of remaining cost.

```python
import heapq

def a_star(graph, start, goal, h):
    # h: heuristic function, h(node) → estimated remaining cost
    g = {start: 0}
    heap = [(h(start), 0, start)]
    while heap:
        f, gn, u = heapq.heappop(heap)
        if u == goal: return gn
        if gn > g[u]: continue        # stale entry
        for v, w in graph[u]:
            ng = gn + w
            if ng < g.get(v, float('inf')):
                g[v] = ng
                heapq.heappush(heap, (ng + h(v), ng, v))
    return float('inf')
```

**Complexity:** O(b^d) worst case, where b is branching factor and d is depth. Heuristic quality determines how close to linear it gets.

**Gotchas:**

- The heuristic must be **admissible**: it must never overestimate the true remaining cost. Otherwise A* loses optimality.
- For a stronger guarantee (no node revisits), the heuristic should be **consistent**: `h(u) <= cost(u, v) + h(v)`. Manhattan distance on a grid is consistent; straight-line distance in a road network is consistent if you can travel in straight lines.
- A* with `h ≡ 0` is just Dijkstra. A* with a perfect `h` walks straight to the goal.

---

## Floyd's cycle detection (tortoise and hare)

**What:** detect a cycle in a linked list (or any function iteration) using **O(1) space**.

**When:** linked list cycle detection, finding the start of a cycle, hash function cycle detection.

**How:** two pointers, one moving twice as fast. They meet inside the cycle iff a cycle exists.

```python
def has_cycle(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

def find_cycle_start(head):
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            break
    else:
        return None
    # Phase 2: reset slow to head; advance both at same pace
    slow = head
    while slow is not fast:
        slow = slow.next
        fast = fast.next
    return slow
```

**Complexity:** O(n) time, O(1) space.

**Gotchas:**

- The phase-2 trick (resetting `slow` to head) lands both pointers exactly at the cycle's start. The math: if μ is the distance from head to cycle start and λ is cycle length, the meeting point is μ + k·λ for some k. Walking μ steps from head and from the meeting point arrives at the start simultaneously.
- This generalizes to any function iteration `f(f(f(...x...)))`. Used in Pollard's rho factorization and in finding period of a PRNG.

---

## Quickselect (kth smallest)

**What:** find the kth smallest element in O(n) average time **without sorting**.

**When:** "find the kth largest/smallest," median-finding when you only need the median, percentile estimation.

**How:** quicksort's partition step, but only recurse into the side containing the kth element.

```python
import random

def quickselect(nums, k):
    # k is 1-indexed: k=1 returns smallest
    target = k - 1
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        pivot = nums[random.randint(lo, hi)]
        i, j = lo, hi
        while i <= j:
            while nums[i] < pivot: i += 1
            while nums[j] > pivot: j -= 1
            if i <= j:
                nums[i], nums[j] = nums[j], nums[i]
                i += 1
                j -= 1
        if target <= j: hi = j
        elif target >= i: lo = i
        else: return nums[target]
    return nums[lo]
```

**Complexity:** O(n) average, O(n²) worst case. With a random pivot, the worst case is unlikely.

**Gotchas:**

- Without random pivots, sorted input degrades to O(n²). Always randomize.
- Median-of-medians gives a deterministic O(n), but the constants are bad enough that random pivot quickselect wins in practice.
- Python's `heapq.nsmallest(k, nums)[-1]` is often easier to write and gives O(n log k). For small k, it competes with quickselect.

---

## KMP string matching

**What:** find a pattern of length m inside a text of length n in **O(n + m)**, no reset on partial match.

**When:** substring search, plagiarism detection, DNA sequence matching.

**How:** preprocess the pattern into a "failure function" (longest proper prefix that's also a suffix). On mismatch, jump to the next viable alignment instead of backing up.

```python
def kmp_search(text, pattern):
    if not pattern: return 0
    # Build failure function (longest prefix-suffix array)
    lps = [0] * len(pattern)
    length = 0
    i = 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1

    # Search
    i = j = 0
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):
                return i - j
        elif j:
            j = lps[j - 1]
        else:
            i += 1
    return -1
```

**Complexity:** O(n + m) time, O(m) space.

**Gotchas:**

- Building the failure function is the trickiest part. The intuition: `lps[i]` is the longest proper prefix of `pattern[:i+1]` that's also a suffix. On mismatch, you fall back to `lps[j-1]`.
- Python's built-in `str.find` and `re` are usually fast enough. Reach for KMP when you need to roll your own (e.g., on streamed input where you can't load the full text).

---

## Cycle detection in directed graphs (DFS three-color)

**What:** detect cycles in a directed graph during DFS using **white / gray / black** coloring.

**When:** validating DAGs, detecting circular dependencies in topological sort.

**How:** WHITE = unvisited, GRAY = currently on DFS stack, BLACK = finished. A back edge (DFS to a GRAY node) is a cycle.

```python
WHITE, GRAY, BLACK = 0, 1, 2

def has_cycle(graph, V):
    color = [WHITE] * V

    def dfs(u):
        color[u] = GRAY
        for v in graph[u]:
            if color[v] == GRAY: return True
            if color[v] == WHITE and dfs(v): return True
        color[u] = BLACK
        return False

    for u in range(V):
        if color[u] == WHITE and dfs(u):
            return True
    return False
```

**Complexity:** O(V + E) time, O(V) space.

**Gotchas:**

- For **undirected** graphs, the "GRAY ancestor" check fires falsely on the parent edge. Track the parent and skip it: `if v == parent: continue`.
- The black state matters in directed graphs: a finished node may be a target of edges from elsewhere without forming a cycle.

---

## When to pick which (decision matrix)

| Need | Algorithm |
|---|---|
| Shortest path, non-negative weights, single source | Dijkstra |
| Shortest path, any weights, single source | Bellman-Ford |
| Shortest path, all pairs, small dense graph | Floyd-Warshall |
| Shortest path, with goal heuristic | A* |
| MST, sparse graph | Kruskal |
| MST, dense graph | Prim |
| Topological order, simple | Kahn's |
| Topological order + cycle detection in one pass | DFS three-color |
| SCC | Tarjan or Kosaraju |
| Connected components, undirected | DFS or Union-Find |
| Dynamic connectivity (online unions) | Union-Find |
| Cycle in linked list, O(1) space | Floyd's tortoise-and-hare |
| Kth smallest without sorting | Quickselect |
| Substring search, custom | KMP |

---

## The shapes you'll quote

The reflexes worth memorizing:

| Shape | Time | Space |
|---|---|---|
| Single-source shortest path (heap) | O((V+E) log V) | O(V) |
| Single-source shortest path (with negatives) | O(V·E) | O(V) |
| All-pairs shortest path | O(V³) | O(V²) |
| Topological sort | O(V+E) | O(V) |
| MST | O(E log E) | O(V) |
| SCC | O(V+E) | O(V) |
| Quickselect | O(n) avg | O(1) |
| KMP search | O(n + m) | O(m) |
| Union-Find op | O(α(n)) ≈ O(1) | O(n) |

If you can name the shape, you can quote the bound. Half the interview battle is recognizing **which named algorithm fits** and saying its complexity in the same breath.

---

## References

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms* (CLRS), 4th ed. The reference for every algorithm here.
- [Competitive Programmer's Handbook (PDF)](https://cses.fi/book/book.pdf), Antti Laaksonen, free; concise treatments of all the graph algorithms.
- [USACO Guide](https://usaco.guide/), categorized by topic with code examples.
- [Tushar Roy's algorithms playlist](https://www.youtube.com/c/tusharroy2525), good visual walkthroughs of Tarjan, KMP, and others.

## Related topics

- [Data structure complexity cheat sheet](../2026-04-27-data-structure-complexity-cheat-sheet/), the structures these algorithms run on.
- [LeetCode 150](../../topics/cs/leetcode-150/), problems organized by pattern, with solutions citing these algorithms.
- [Graphs](../../topics/cs/data-structures/graphs/), the longer-form data-structure page.
- [Heaps and priority queues](../../topics/cs/data-structures/heaps/), the structure underneath Dijkstra and Prim.
