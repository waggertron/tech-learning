---
title: Graph theory
description: "Vertices, edges, directed vs undirected, weighted vs unweighted, adjacency representations, paths, cycles, components, strongly connected components, DAGs, bipartite graphs, and how all of it maps to real-world problem modeling."
category: cs
tags: [graphs, graph-theory, algorithms, data-structures, interviews, modeling]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Why graphs

Every data structure you know is a special case of a graph. A linked list is a path graph. A tree is a connected acyclic graph. A grid is an implicit graph where cells are vertices and adjacency is directional. A state machine is a directed graph where nodes are states and edges are transitions. The moment a problem involves pairwise relationships between entities, you are in graph territory. Graphs are the most general modeling tool in computer science because "pairwise relationship" is almost the broadest constraint you can impose on a problem while still having something useful to say.

---

## Terminology

The vocabulary matters. Algorithms are stated precisely in this language, and LeetCode problem statements use it without definition.

| Term | Definition |
| --- | --- |
| **Vertex / node** | A fundamental unit. Labeled by an id or value. |
| **Edge / arc** | A connection between two vertices. |
| **Directed edge** | An edge from `u` to `v` with a direction: `u -> v`. |
| **Undirected edge** | A connection between `u` and `v` with no direction: `u -- v`. |
| **Degree** | Number of edges incident to a vertex (undirected graphs). |
| **In-degree** | Number of edges arriving at a vertex (directed graphs). |
| **Out-degree** | Number of edges leaving a vertex (directed graphs). |
| **Weight / cost / label** | A numeric value attached to an edge. Represents distance, cost, time, capacity, probability, etc. |
| **Neighbor** | Vertex `v` is a neighbor of `u` if there is an edge `u -> v` (directed) or `u -- v` (undirected). |
| **Adjacency** | Two vertices are adjacent if they share an edge. |
| **Walk** | A sequence of vertices where consecutive vertices are connected by edges. Vertices and edges may repeat. |
| **Trail** | A walk where no edge is repeated. Vertices may repeat. |
| **Path** | A walk where no vertex is repeated. |
| **Simple path** | Synonym for path in most modern usage. |
| **Cycle** | A walk that starts and ends at the same vertex and has at least one edge. |
| **Simple cycle** | A cycle where no vertex is repeated except the start/end. |
| **Self-loop** | An edge from a vertex to itself: `u -> u`. |
| **Parallel edges** | Two or more edges connecting the same pair of vertices in the same direction. |
| **Multigraph** | A graph that allows parallel edges or self-loops. |
| **Simple graph** | A graph with no self-loops and no parallel edges. Most algorithm problems assume simple graphs. |
| **Sparse graph** | E is much smaller than V². Real-world graphs are almost always sparse. |
| **Dense graph** | E is close to V². Adjacency matrix representation shines here. |

---

## Graph representations

There are four representations in common use. Choosing the right one affects both memory and algorithmic efficiency.

### Adjacency list (default choice)

Space: O(V + E). Iteration over neighbors: O(degree(u)). Edge existence check: O(degree(u)).

Use this unless you have a reason not to. It handles sparse graphs cleanly and is what every standard graph algorithm assumes.

```python
from collections import defaultdict

# Directed weighted graph
adj = defaultdict(list)

def add_edge(adj, u, v, w=1):
    adj[u].append((v, w))

# Build from edge list
edges = [(0, 1, 4), (0, 2, 2), (1, 3, 5), (2, 3, 8), (2, 4, 10), (3, 4, 2)]
for u, v, w in edges:
    add_edge(adj, u, v, w)

# Undirected: add both directions
def add_undirected_edge(adj, u, v, w=1):
    adj[u].append((v, w))
    adj[v].append((u, w))
```

Iterating over all neighbors of `u`:

```python
for neighbor, weight in adj[u]:
    # process edge u -> neighbor with cost weight
    pass
```

### Adjacency matrix

Space: O(V²). Iteration over neighbors: O(V). Edge existence check: O(1).

Use when V is small (V <= 1000) and you need fast edge lookup. Also useful when the graph is dense (E close to V²).

```python
def build_matrix(n, edges, directed=False):
    mat = [[0] * n for _ in range(n)]
    for u, v, w in edges:
        mat[u][v] = w
        if not directed:
            mat[v][u] = w
    return mat

# Check if edge exists:
if mat[u][v] != 0:
    pass

# Iterate over neighbors of u:
for v in range(n):
    if mat[u][v] != 0:
        pass  # edge u -> v with weight mat[u][v]
```

The O(V) neighbor iteration is the main cost. If V = 10000 and E = 20000, you pay 10000 iterations per vertex instead of 2 on average. That is why adjacency matrix is a bad default for sparse graphs.

### Edge list

Space: O(E). Useful when you want to process edges globally rather than per-vertex.

Used by:
- **Bellman-Ford**: iterates over all edges V-1 times.
- **Kruskal's MST**: sorts edges by weight, then greedily adds them.

```python
# Edge list: list of (u, v, weight) tuples
edges = [
    (0, 1, 4),
    (0, 2, 2),
    (1, 3, 5),
    (2, 3, 8),
    (3, 4, 2),
]

# Bellman-Ford style: relax all edges V-1 times
def bellman_ford(n, edges, src):
    dist = [float('inf')] * n
    dist[src] = 0
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist
```

### Implicit graph

Space: O(1) for the graph itself (you store only the problem state). Neighbors are computed on the fly from the current node's coordinates or state.

Grid problems are the canonical example. The graph is never materialized: you just define a `get_neighbors` function.

```python
# Grid as an implicit graph
# Each cell (r, c) is a vertex.
# Neighbors are the four cardinal directions, if in bounds.

DIRECTIONS = [(0, 1), (0, -1), (1, 0), (-1, 0)]

def get_neighbors(r, c, rows, cols):
    for dr, dc in DIRECTIONS:
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols:
            yield nr, nc

# BFS over a grid (shortest path in steps):
from collections import deque

def bfs_grid(grid, start_r, start_c, end_r, end_c):
    rows, cols = len(grid), len(grid[0])
    visited = [[False] * cols for _ in range(rows)]
    visited[start_r][start_c] = True
    q = deque([(start_r, start_c, 0)])  # (row, col, distance)
    while q:
        r, c, dist = q.popleft()
        if r == end_r and c == end_c:
            return dist
        for nr, nc in get_neighbors(r, c, rows, cols):
            if not visited[nr][nc] and grid[nr][nc] != '#':
                visited[nr][nc] = True
                q.append((nr, nc, dist + 1))
    return -1
```

State machines generalize the implicit graph idea: instead of `(row, col)`, the node is `(position, extra_state)`. Examples: `(city, num_stops_remaining)` in the cheapest flights problem, `(cell, key_bitmask)` in a maze-with-keys problem.

### Representation comparison

| Representation | Space | Neighbor iteration | Edge check | Best for |
| --- | --- | --- | --- | --- |
| Adjacency list | O(V + E) | O(degree(u)) | O(degree(u)) | Sparse graphs (default) |
| Adjacency matrix | O(V²) | O(V) | O(1) | Dense graphs, fast edge lookup |
| Edge list | O(E) | N/A | O(E) | Bellman-Ford, Kruskal's |
| Implicit | O(1) | O(1) per neighbor | N/A | Grids, state machines |

---

## Directed vs undirected

In a **directed graph** (digraph), each edge has a direction. `u -> v` does not imply `v -> u`. In an **undirected graph**, every edge is symmetric: `u -- v` means you can go either way.

```python
from collections import defaultdict

def build_directed(edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)        # one direction only
    return adj

def build_undirected(edges):
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)        # both directions
        adj[v].append(u)
    return adj

# Undirected is just symmetric directed:
# build_undirected is equivalent to treating each undirected edge
# as two directed edges in opposite directions.
```

**Cycle detection differs between the two.**

In an **undirected graph**, a DFS that encounters an already-visited vertex (other than the immediate parent) has found a cycle. Track the parent to avoid false positives:

```python
def has_cycle_undirected(adj, n):
    visited = [False] * n

    def dfs(u, parent):
        visited[u] = True
        for v in adj[u]:
            if not visited[v]:
                if dfs(v, u):
                    return True
            elif v != parent:   # visited, but not our parent -> cycle
                return True
        return False

    for i in range(n):
        if not visited[i]:
            if dfs(i, -1):
                return True
    return False
```

In a **directed graph**, you need three-color DFS (white / gray / black):
- White: unvisited.
- Gray: currently in the DFS call stack (ancestor in the current path).
- Black: fully processed.

A back edge (gray -> gray) signals a cycle. A gray -> black edge is not a cycle in a directed graph; it means you reached a previously finished subtree.

```python
def has_cycle_directed(adj, n):
    # 0 = white, 1 = gray, 2 = black
    color = [0] * n

    def dfs(u):
        color[u] = 1  # gray: on the current path
        for v in adj[u]:
            if color[v] == 1:
                return True   # back edge: cycle
            if color[v] == 0 and dfs(v):
                return True
        color[u] = 2  # black: done
        return False

    for i in range(n):
        if color[i] == 0:
            if dfs(i):
                return True
    return False
```

The trap: many people apply the undirected cycle detection (parent tracking) to a directed graph. It produces wrong answers. A -> B -> C -> A is a cycle in a directed graph; the parent of C is B, not A, so parent tracking would miss it.

---

## Weighted graphs

A **weight** (also called cost or label) is a numeric value on an edge. What a weight represents depends entirely on the problem:

| Domain | What the weight means |
| --- | --- |
| Road network | Travel time or distance in km |
| Flight routes | Ticket price or flight duration in minutes |
| Network topology | Bandwidth capacity (bytes/sec) |
| Currency exchange | Exchange rate (use log for additive conversion) |
| Probabilistic model | Probability of transition |
| Project scheduling | Task duration in hours or days |

Weights change which algorithm applies. Equal weights (or unweighted) means BFS is optimal. Non-negative weights means Dijkstra. Negative weights (no negative cycles) means Bellman-Ford. A DAG means relax in topological order.

```python
# Weighted adjacency list: adj[u] = [(v, weight), ...]
from collections import defaultdict

def build_weighted(edges, directed=False):
    adj = defaultdict(list)
    for u, v, w in edges:
        adj[u].append((v, w))
        if not directed:
            adj[v].append((u, w))
    return adj
```

### Concrete modeling examples

**Flight routes (shortest travel time):**

Vertices = airports. Edge `(LAX, JFK, 300)` means a 300-minute flight. Dijkstra from source airport gives shortest total travel time to every destination. Add a layover penalty as additional edge weight if needed.

**Road network (fastest route):**

Vertices = road intersections. Edge weight = travel time in seconds. Dijkstra produces turn-by-turn routing. Traffic conditions are dynamic weight updates, handled by re-running Dijkstra or by incremental shortest-path algorithms.

**Network bandwidth (maximum throughput):**

Vertices = routers. Edge weight = capacity in Mbps. The question "what is the maximum amount of data that can flow from source to sink per second?" is a **max flow** problem. The graph structure is the same; the algorithm is Ford-Fulkerson or Dinic's rather than Dijkstra.

**Probability (most likely path):**

Edge weight = probability of a transition. You want to maximize the product of probabilities along a path. Dijkstra works with a modification: instead of summing weights, multiply them; instead of minimizing, maximize. Use a max-heap (negate values in Python).

```python
import heapq

def max_probability_path(n, edges, probs, src, dst):
    adj = defaultdict(list)
    for i, (u, v) in enumerate(edges):
        adj[u].append((v, probs[i]))
        adj[v].append((u, probs[i]))

    prob = [0.0] * n
    prob[src] = 1.0
    heap = [(-1.0, src)]  # max-heap via negation

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

---

## Paths and connectivity

A **path** from `u` to `v` is a sequence of vertices `u = v0, v1, ..., vk = v` where each consecutive pair is connected by an edge, and no vertex repeats.

```
Vertex layout example:

   A --- B --- D
   |         /
   C --------

Paths from A to D:
  A -> B -> D  (length 2)
  A -> C -> D  (length 2)
  A -> B -> D is a simple path (no vertex repeated)
```

A graph is **connected** if there is a path between every pair of vertices (undirected). A directed graph is **strongly connected** if every vertex can reach every other vertex.

A graph is **disconnected** if at least one pair of vertices has no path between them.

A graph is **biconnected** (2-vertex-connected) if removing any single vertex leaves it connected. Biconnected components are found via Tarjan's bridge/articulation-point algorithm.

**Testing connectivity with DFS:**

```python
def is_connected(adj, n):
    """Returns True if the undirected graph on n vertices is connected."""
    if n == 0:
        return True
    visited = set()

    def dfs(u):
        visited.add(u)
        for v in adj[u]:
            if v not in visited:
                dfs(v)

    dfs(0)
    return len(visited) == n
```

**Testing connectivity with BFS:**

```python
from collections import deque

def is_connected_bfs(adj, n):
    visited = set([0])
    q = deque([0])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in visited:
                visited.add(v)
                q.append(v)
    return len(visited) == n
```

---

## Connected components (undirected)

A **connected component** is a maximal connected subgraph. "Maximal" means you cannot add another vertex and keep it connected.

The standard pattern: loop over all vertices. When you find an unvisited one, run DFS/BFS from it. Everything reachable is in one component. Repeat.

```python
def find_components(adj, n):
    """
    Returns a list of components, each as a set of vertex ids.
    Runs in O(V + E).
    """
    visited = [False] * n
    components = []

    def dfs(u, component):
        visited[u] = True
        component.add(u)
        for v in adj[u]:
            if not visited[v]:
                dfs(v, component)

    for i in range(n):
        if not visited[i]:
            comp = set()
            dfs(i, comp)
            components.append(comp)

    return components

# Component labeling (assign each vertex a component id):
def label_components(adj, n):
    label = [-1] * n
    component_id = 0

    def dfs(u, cid):
        label[u] = cid
        for v in adj[u]:
            if label[v] == -1:
                dfs(v, cid)

    for i in range(n):
        if label[i] == -1:
            dfs(i, component_id)
            component_id += 1

    return label, component_id  # label[v] = component id; component_id = total count
```

This exact pattern solves [LeetCode 200 (Number of Islands)](../leetcode-150/graphs/200-number-of-islands/), 323 (Number of Connected Components), and 547 (Number of Provinces). The graph is implicit in the grid or the adjacency list; the loop-and-DFS structure is identical.

---

## Strongly connected components (directed)

In a directed graph, a **strongly connected component (SCC)** is a maximal set of vertices S such that for every pair u, v in S, there is a directed path from u to v and from v to u.

This is a strictly directed concept. In an undirected graph, "strongly connected" and "connected" collapse into the same definition, so the term SCC is only used for digraphs.

```
Example directed graph:

  0 -> 1 -> 2
  ^         |
  |         v
  4 <- 3 <--+

SCCs:
  {0, 1, 2, 3, 4}  -- all five vertices form one SCC
                       (0->1->2->3->4->0 is a cycle covering all)

Another example:

  0 -> 1    2 -> 3
       |         |
       v         v
       4         5

SCCs: {0}, {1}, {4}, {2}, {3}, {5}  -- each vertex alone, no cycles
```

The **condensation DAG** is the graph you get by collapsing each SCC to a single supernode. The result is always a DAG (if it had a cycle, those two supernodes would be in the same SCC). The condensation DAG reveals the top-level structure of a directed graph: which "clusters" feed into which others.

**Naive SCC detection** (for small graphs, or when you only need to check if two vertices are in the same SCC):

```python
from collections import defaultdict, deque

def reachable(adj, src, n):
    """BFS: set of vertices reachable from src."""
    visited = set([src])
    q = deque([src])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in visited:
                visited.add(v)
                q.append(v)
    return visited

def naive_sccs(adj, n):
    """
    O(V * (V + E)): for each vertex u, find what u can reach and what can reach u.
    Two vertices are in the same SCC iff each can reach the other.
    Returns a list of SCCs as frozensets.
    """
    # Build reverse graph
    radj = defaultdict(list)
    for u in range(n):
        for v in adj[u]:
            radj[v].append(u)

    visited = [False] * n
    sccs = []

    for i in range(n):
        if visited[i]:
            continue
        # SCC of i = (vertices reachable from i in adj) INTERSECT (vertices reachable from i in radj)
        forward = reachable(adj, i, n)
        backward = reachable(radj, i, n)
        scc = forward & backward
        for v in scc:
            visited[v] = True
        sccs.append(frozenset(scc))

    return sccs
```

For large graphs, use Tarjan's algorithm or Kosaraju's algorithm (both O(V + E)). See [Tarjan's algorithm](../named-algorithms/tarjans/).

---

## DAGs (Directed Acyclic Graphs)

A **DAG** is a directed graph with no directed cycles. The acyclicity property guarantees that a **topological ordering** always exists: a linear ordering of vertices such that for every directed edge `u -> v`, `u` comes before `v`.

Topological ordering is the foundation of a wide class of algorithms: any time you need to process dependencies before dependents, you want a topological sort.

**Why acyclicity matters:** a cycle in a dependency graph means "A depends on B depends on A", which is a circular dependency. There is no valid processing order. DAGs rule this out by definition.

### Kahn's algorithm (topological sort via BFS on in-degree)

```python
from collections import deque, defaultdict

def topological_sort(n, edges):
    """
    n     -- number of vertices (0-indexed)
    edges -- list of (u, v) meaning u must come before v

    Returns a valid topological ordering, or [] if the graph has a cycle.
    """
    adj = defaultdict(list)
    in_degree = [0] * n

    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1

    # Start with all vertices that have no prerequisites
    q = deque([i for i in range(n) if in_degree[i] == 0])
    order = []

    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)

    # If we processed all vertices, no cycle exists.
    # Otherwise, the remaining vertices form a cycle.
    return order if len(order) == n else []
```

**Use cases for DAGs:**

- **Dependency resolution**: npm, pip, Maven. Install packages whose dependencies are already installed.
- **Build systems**: Make, Bazel, Gradle. Compile targets in an order where all inputs exist before outputs.
- **Task scheduling**: Project tasks where some must finish before others start.
- **Spreadsheet evaluation**: Cell A3 depends on A1 + A2. Recompute in topological order.
- **Neural network forward pass**: Each layer's output is input to the next; no cycles allowed.
- **Course prerequisites**: Take linear algebra before machine learning. Topological sort gives a valid course sequence.
- **Git commit graph**: Each commit points to its parent(s). The commit history is a DAG (merges create multiple parents).

---

## Trees as graphs

A **tree** is a connected acyclic undirected graph. This is not a separate data structure; it is a special case of a graph satisfying:

1. It is connected (there is a path between every pair of vertices).
2. It has no cycles.

These two properties together imply: a tree on V vertices has exactly V-1 edges. Remove one edge and it disconnects. Add one edge and it gains a cycle.

Equivalently: there is a unique path between any two vertices in a tree. If there were two paths, they would form a cycle.

```
Tree with 5 vertices:

  0 -- 1 -- 3
  |
  2 -- 4

Edges: 4 = 5 - 1. Correct.
Remove 0-2: disconnected (0,1,3 separate from 2,4). Correct.
Add 1-4: cycle 1-3... wait, no. Add 0-3: creates cycle 0-1-3-0. Correct.
```

A **rooted tree** is a tree with one vertex designated as the root. This gives a parent-child hierarchy. The choice of root is arbitrary; any vertex can be the root.

A **spanning tree** of a graph G is a subgraph that is a tree and includes all V vertices. Every connected graph has at least one spanning tree. A **minimum spanning tree (MST)** is a spanning tree with the minimum total edge weight. MSTs are found by Kruskal's or Prim's algorithm (see the modeling examples section below).

---

## Bipartite graphs

A graph is **bipartite** if its vertices can be divided into two disjoint sets L and R such that every edge connects a vertex in L to a vertex in R. No edge exists within L alone or within R alone.

Equivalently: a graph is bipartite if and only if it can be 2-colored (no two adjacent vertices share a color) if and only if it contains no odd-length cycle.

```
Bipartite:          Not bipartite (triangle = odd cycle):

L side | R side          A
  A  --  C               |\ 
  A  --  D               | \
  B  --  C               |  \
  B  --  D              B -- C
```

**Detection via BFS 2-coloring:**

```python
from collections import deque

def is_bipartite(adj, n):
    """
    Returns True if the graph is bipartite.
    Uses BFS 2-coloring: assign color 0 or 1 alternately.
    If we ever need to assign both colors to the same vertex, it's not bipartite.
    """
    color = [-1] * n  # -1 = uncolored

    for start in range(n):
        if color[start] != -1:
            continue
        color[start] = 0
        q = deque([start])
        while q:
            u = q.popleft()
            for v in adj[u]:
                if color[v] == -1:
                    color[v] = 1 - color[u]  # flip color
                    q.append(v)
                elif color[v] == color[u]:
                    return False  # same color on both ends of an edge

    return True
```

**Use cases for bipartite graphs:**

- **Job matching / assignment**: L = workers, R = jobs. Edges = eligible assignments. Maximum bipartite matching (Hungarian algorithm) finds the maximum number of assignments.
- **Recommendation systems**: L = users, R = items. Edges = interactions. Collaborative filtering is often framed as bipartite link prediction.
- **Scheduling**: L = tasks, R = time slots. Feasible schedules = matchings.
- **Checking validity**: LeetCode 886 (Possible Bipartition), LeetCode 785 (Is Graph Bipartite?).

---

## Encoding weights to model problems

This is the most practical skill in graph theory: given a real-world problem, how do you cast it as a weighted graph problem, and which algorithm solves it?

### 1. Shortest delivery route (Dijkstra)

**Problem**: A courier starts at a warehouse and must reach a customer address with minimum travel time. Road intersections are vertices. Road segments are edges with weight = travel time in seconds.

```python
import heapq
from collections import defaultdict

def shortest_delivery(roads, n, warehouse, customer):
    """
    roads: list of (intersection_a, intersection_b, travel_time_seconds)
    Returns: minimum travel time from warehouse to customer, or -1 if unreachable.
    """
    adj = defaultdict(list)
    for u, v, t in roads:
        adj[u].append((v, t))
        adj[v].append((u, t))  # undirected: two-way roads

    dist = [float('inf')] * n
    dist[warehouse] = 0
    heap = [(0, warehouse)]

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, t in adj[u]:
            nd = d + t
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(heap, (nd, v))

    return dist[customer] if dist[customer] < float('inf') else -1
```

### 2. Fewest currency conversions (BFS on implicit graph)

**Problem**: You have a set of currencies and direct exchange pairs. Find the minimum number of conversions to get from currency A to currency B.

Each currency is a vertex. A direct exchange pair is an edge (unweighted, since we want fewest conversions, not best rate). BFS gives the fewest-hop path.

```python
from collections import deque, defaultdict

def min_conversions(pairs, source, target):
    """
    pairs: list of (currency_a, currency_b) indicating direct exchange is available
    Returns: minimum number of conversions, or -1 if impossible.
    """
    adj = defaultdict(set)
    for a, b in pairs:
        adj[a].add(b)
        adj[b].add(a)

    if source == target:
        return 0

    visited = {source}
    q = deque([(source, 0)])  # (currency, num_conversions)
    while q:
        curr, steps = q.popleft()
        for nxt in adj[curr]:
            if nxt == target:
                return steps + 1
            if nxt not in visited:
                visited.add(nxt)
                q.append((nxt, steps + 1))
    return -1
```

### 3. Maximum network throughput (max flow framing)

**Problem**: Routers are vertices. Network links are directed edges with capacity (weight = Mbps). What is the maximum data flow from a source server to a destination server?

This is a max flow problem. The graph setup: vertices = routers, directed edges with capacity weights. The algorithm is Ford-Fulkerson (DFS-based, O(E * max_flow)) or Dinic's (BFS-based, O(V² * E), better for large instances). Max flow is a separate topic, but the modeling is pure weighted directed graph.

### 4. Minimum cost to span all offices (Kruskal's MST)

**Problem**: You have N offices. You can install a network link between any pair with a known installation cost. Connect all offices with minimum total installation cost.

This is the classic MST problem. Vertices = offices. Edges = possible links with weight = cost. Kruskal's sorts edges by weight and greedily adds them if they don't create a cycle (using Union-Find).

```python
def kruskal_mst(n, edges):
    """
    n:     number of offices (vertices 0..n-1)
    edges: list of (cost, u, v)
    Returns: total minimum cost to connect all offices, or -1 if impossible.
    """
    parent = list(range(n))
    rank = [0] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]  # path compression
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return False  # same component: adding this edge creates a cycle
        if rank[ra] < rank[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        if rank[ra] == rank[rb]:
            rank[ra] += 1
        return True

    edges.sort()  # sort by cost
    total_cost = 0
    edges_used = 0

    for cost, u, v in edges:
        if union(u, v):
            total_cost += cost
            edges_used += 1
            if edges_used == n - 1:
                break  # MST complete

    return total_cost if edges_used == n - 1 else -1
```

### 5. Earliest possible project completion (critical path on a DAG)

**Problem**: A project has tasks. Some tasks must complete before others start (dependencies). Each task has a duration. What is the earliest the entire project can finish?

Model: vertices = tasks + a source vertex (start). Edge `u -> v` with weight = duration of task u means "after u finishes, v can start." Run a longest-path algorithm on the DAG. Longest path on a DAG is solved by relaxing edges in topological order.

```python
from collections import defaultdict, deque

def critical_path(n, dependencies, durations):
    """
    n:            number of tasks (0-indexed)
    dependencies: list of (u, v) meaning task u must finish before task v starts
    durations:    durations[i] = duration of task i

    Returns: earliest time by which all tasks complete.
    """
    adj = defaultdict(list)
    in_degree = [0] * n
    for u, v in dependencies:
        adj[u].append(v)
        in_degree[v] += 1

    # Kahn's for topological order
    q = deque([i for i in range(n) if in_degree[i] == 0])
    # earliest_start[v] = earliest time task v can begin
    earliest_start = [0] * n

    processed = 0
    while q:
        u = q.popleft()
        processed += 1
        finish_time = earliest_start[u] + durations[u]
        for v in adj[u]:
            earliest_start[v] = max(earliest_start[v], finish_time)
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)

    if processed < n:
        return -1  # cycle detected: no valid schedule

    return max(earliest_start[i] + durations[i] for i in range(n))
```

---

## Common graph patterns in LeetCode

Pattern recognition saves time. When you see a certain problem shape, you should immediately know the graph structure and the algorithm.

| Problem shape | Graph structure | Algorithm | Example LeetCode |
| --- | --- | --- | --- |
| 2D grid, find connected regions | Implicit graph (cells = vertices, 4-directional adjacency) | DFS/BFS flood-fill | 200 Number of Islands |
| Grid, shortest path in steps | Implicit graph with uniform edge weights | BFS | 994 Rotting Oranges |
| Grid, shortest path with cell costs | Implicit graph with weighted edges | Dijkstra | 778 Swim in Rising Water |
| State machine (position + extra state) | Explicit graph: node = (position, state) | BFS or Dijkstra depending on weights | 787 Cheapest Flights |
| Word transformation (Hamming distance 1) | Implicit graph: words are nodes, edge if differ by 1 letter | BFS | 127 Word Ladder |
| Task dependencies | DAG | Topological sort (Kahn's) | 207 Course Schedule |
| Detect cycle in course schedule | Directed graph | 3-color DFS or Kahn's (cycle = not all processed) | 207 Course Schedule |
| Find components / provinces | Undirected graph | DFS/BFS loop + visited set | 547 Number of Provinces |
| Minimum connection cost | Weighted undirected graph | MST (Kruskal's or Prim's) | 1584 Min Cost to Connect All Points |
| Shortest path, non-negative weights | Weighted directed/undirected | Dijkstra | 743 Network Delay Time |
| Shortest path, possible negative weights | Weighted directed | Bellman-Ford | 787 variant |

**Key coding patterns:**

1. **Grid = implicit graph**: translate `(row, col)` as vertex; iterate `DIRECTIONS` for neighbors.
2. **State = (position, extra)**: when position alone doesn't capture enough context, extend the state.
3. **Word transformation**: precompute buckets by wildcard pattern (`h*t` -> ["hat", "hit", "hot"]) for efficient neighbor lookup.
4. **Dependencies = DAG**: build the graph from the constraint list; Kahn's for order; cycle detection is a freebie (len(order) < n).

For the LeetCode problems themselves:
- Graph problems: [../leetcode-150/graphs/](../leetcode-150/graphs/)
- Advanced graph problems: [../leetcode-150/advanced-graphs/](../leetcode-150/advanced-graphs/)

---

## References

- [Graph theory, Wikipedia](https://en.wikipedia.org/wiki/Graph_theory): broad survey of definitions, theorems, and history.
- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms* (CLRS), Part VI (Chapters 22-26): BFS, DFS, topological sort, SCCs, MST, shortest paths. The definitive textbook treatment.
- Sedgewick and Wayne. *Algorithms* (4th ed.), Chapters 4.1-4.4: undirected graphs, directed graphs, MST, shortest paths. Java-based but the explanations are excellent.
- [CP-Algorithms: Graph algorithms](https://cp-algorithms.com/graph/): practical implementations with complexity analysis for DFS, BFS, Dijkstra, Bellman-Ford, Floyd-Warshall, topological sort, SCCs, bridges, articulation points.
- [NeetCode graph roadmap](https://neetcode.io/roadmap): curated problem list organized by pattern; useful for knowing which problems to solve in which order.

---

## Related topics

- [Dijkstra's algorithm](../named-algorithms/dijkstra/): single-source shortest paths on non-negative weighted graphs
- [BFS](../named-algorithms/bfs/): shortest path (unweighted), level-order traversal, multi-source patterns
- [DFS](../named-algorithms/dfs/): reachability, cycle detection, topological sort, SCCs
- [Kahn's algorithm](../named-algorithms/kahns/): topological sort via BFS on in-degree
- [Bellman-Ford](../named-algorithms/bellman-ford/): shortest paths with negative edge weights, negative cycle detection
- [Tarjan's algorithm](../named-algorithms/tarjans/): SCCs and bridges in O(V + E)
- [Graphs (data structures)](../data-structures/graphs/): implementations and algorithm complexity table
- [LeetCode 150: Graphs](../leetcode-150/graphs/): the 13 standard graph problems
- [LeetCode 150: Advanced Graphs](../leetcode-150/advanced-graphs/): Dijkstra, MST, Bellman-Ford problems
