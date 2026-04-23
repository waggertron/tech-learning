---
title: Graphs
description: Nodes connected by edges — directed or undirected, weighted or unweighted. The most general structure in interviews; many real-world modeling problems reduce to a graph.
parent: data-structures
tags: [data-structures, graphs, bfs, dfs, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

A **graph** is a set of nodes (vertices) connected by edges. Edges can be directed or undirected, weighted or unweighted. Graphs generalize trees (a tree is a connected acyclic graph) and linked lists (a linear graph). Many real-world modeling problems — social networks, dependency resolution, routing, pipelines — reduce to graph problems. Graphs are the most general and the hardest data structure category in interviews; the effort pays off.

## In-depth description

### Representations

- **Adjacency list** — map from node to list of neighbors. `defaultdict(list)` in Python. O(V + E) space — efficient for sparse graphs (most real-world graphs).
- **Adjacency matrix** — `V × V` boolean or weight matrix. O(V²) space, O(1) edge lookup. Good for dense graphs or where you need fast edge queries.
- **Edge list** — list of `(u, v, weight)` tuples. Compact; used by Kruskal's MST and Bellman-Ford.

### Core algorithms

- **BFS** — O(V + E). Shortest path in an unweighted graph, level-based exploration. Uses a queue.
- **DFS** — O(V + E). Cycle detection, topological sort, connected components, path existence. Uses recursion or an explicit stack.
- **Dijkstra's algorithm** — O((V + E) log V) with a binary heap. Single-source shortest path with non-negative weights.
- **Bellman-Ford** — O(V · E). Single-source shortest path allowing negative weights; detects negative cycles.
- **Floyd-Warshall** — O(V³). All-pairs shortest paths via DP over intermediate nodes.
- **Union-Find (Disjoint Set Union)** — nearly O(1) per op with path compression and union by rank. Connectivity, cycle detection in undirected graphs, Kruskal's MST.
- **Topological sort** — O(V + E). Kahn's algorithm (BFS on zero-in-degree nodes) or DFS post-order reversed. Only defined on DAGs.
- **Kruskal's / Prim's MST** — minimum spanning tree. Kruskal's uses edge list + union-find; Prim's uses a priority queue.

### Directed vs. undirected — a trap

Many algorithms behave differently on directed graphs. Topological sort requires a DAG. Cycle detection in a directed graph needs three-color marking (white/gray/black); in an undirected graph, union-find or a "don't revisit parent" trick works.

## Time complexity (adjacency list)

| Algorithm | Time | Space |
| --- | --- | --- |
| BFS / DFS | O(V + E) | O(V) |
| Dijkstra (binary heap) | O((V + E) log V) | O(V) |
| Bellman-Ford | O(V · E) | O(V) |
| Floyd-Warshall | O(V³) | O(V²) |
| Topological sort | O(V + E) | O(V) |
| Union-Find (ops) | near O(1) per op, O(α(n)) amortized | O(V) |
| Kruskal's / Prim's MST | O(E log V) | O(V + E) |

## Common uses in DSA

1. **Connected components and connectivity** — Number of Islands, Friend Circles / Number of Provinces, Accounts Merge, Graph Valid Tree.
2. **Shortest path** — unweighted via BFS (Word Ladder, Shortest Path in Binary Matrix), weighted via Dijkstra (Network Delay Time, Cheapest Flights), negative via Bellman-Ford.
3. **Topological ordering** — Course Schedule I and II, Alien Dictionary, Parallel Courses.
4. **Cycle detection** — directed (via white/gray/black DFS), undirected (via union-find or DFS with parent tracking).
5. **Minimum spanning tree and network design** — Kruskal's (edge list + union-find), Prim's (priority queue).

**Canonical LeetCode problems:** #127 Word Ladder, #133 Clone Graph, #200 Number of Islands, #207 Course Schedule, #210 Course Schedule II, #261 Graph Valid Tree, #269 Alien Dictionary, #417 Pacific Atlantic Water Flow, #743 Network Delay Time.

## Python example

```python
from collections import defaultdict, deque
import heapq

# Build an adjacency list from an edge list
def build_graph(edges, directed=False):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        if not directed:
            graph[v].append(u)
    return graph

# BFS: shortest path (unweighted)
def bfs_shortest_path(graph, start, target):
    if start == target:
        return 0
    visited = {start}
    q = deque([(start, 0)])
    while q:
        node, dist = q.popleft()
        for neighbor in graph[node]:
            if neighbor == target:
                return dist + 1
            if neighbor not in visited:
                visited.add(neighbor)
                q.append((neighbor, dist + 1))
    return -1

# DFS (iterative) with visited set
def dfs(graph, start):
    visited, stack = set(), [start]
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)
    return visited

# Dijkstra's (non-negative weights); graph: {node: [(neighbor, weight), ...]}
def dijkstra(graph, start):
    dist = {start: 0}
    pq = [(0, start)]
    while pq:
        d, node = heapq.heappop(pq)
        if d > dist.get(node, float('inf')):
            continue
        for neighbor, weight in graph[node]:
            nd = d + weight
            if nd < dist.get(neighbor, float('inf')):
                dist[neighbor] = nd
                heapq.heappush(pq, (nd, neighbor))
    return dist

# Topological sort (Kahn's / BFS on in-degree)
def topo_sort(num_nodes, edges):
    graph = defaultdict(list)
    in_degree = [0] * num_nodes
    for u, v in edges:           # edge u -> v
        graph[u].append(v)
        in_degree[v] += 1
    q = deque([i for i in range(num_nodes) if in_degree[i] == 0])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                q.append(neighbor)
    return order if len(order) == num_nodes else []   # empty -> cycle

# Union-Find (for Kruskal's / connectivity)
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True
```

## References

- [Graph theory — Wikipedia](https://en.wikipedia.org/wiki/Graph_theory)
- [BFS/DFS/Dijkstra — cp-algorithms](https://cp-algorithms.com/graph/breadth-first-search.html)
- [Union-Find with path compression and union-by-rank — cp-algorithms](https://cp-algorithms.com/data_structures/disjoint_set_union.html)
- [CLRS Part VI: Graph Algorithms](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)
- [Graph problems — NeetCode roadmap](https://neetcode.io/roadmap)
