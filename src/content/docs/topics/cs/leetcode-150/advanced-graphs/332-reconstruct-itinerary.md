---
title: "332. Reconstruct Itinerary"
description: Given a list of airline tickets, reconstruct the itinerary that uses every ticket exactly once, starting from "JFK" and lexicographically smallest.
parent: advanced-graphs
tags: [leetcode, neetcode-150, graphs, eulerian-path, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given a list of airline tickets where `tickets[i] = [fromᵢ, toᵢ]`. Reconstruct the itinerary in order. All tickets belong to one person who departs from `"JFK"`. You must use every ticket exactly once; if multiple valid itineraries exist, return the lexicographically smallest.

**Example**
- `tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]` → `["JFK","MUC","LHR","SFO","SJC"]`
- `tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]` → `["JFK","ATL","JFK","SFO","ATL","SFO"]`

LeetCode 332 · [Link](https://leetcode.com/problems/reconstruct-itinerary/) · *Hard*

## Approach 1: Brute force, backtracking

Try every permutation of tickets starting from JFK; pick the lexicographically smallest valid one.

```python
from collections import defaultdict

def find_itinerary(tickets):
    graph = defaultdict(list)
    for src, dst in sorted(tickets):
        graph[src].append(dst)

    target_len = len(tickets) + 1

    def dfs(node, path):
        if len(path) == target_len:
            return list(path)
        for i, nb in enumerate(graph[node]):
            if nb is None:
                continue
            graph[node][i] = None
            path.append(nb)
            result = dfs(nb, path)
            if result:
                return result
            path.pop()
            graph[node][i] = nb
        return None

    return dfs("JFK", ["JFK"])
```

**Complexity**
- **Time:** O(E^E) worst case. Ugly.
- **Space:** O(E).

## Approach 2: Hierholzer's algorithm with lexicographic neighbor selection (optimal)

Hierholzer's builds an Eulerian path in O(E). The trick: always recurse into the **lexicographically smallest** outgoing edge, then prepend the current node to the result as the recursion unwinds.

```python
from collections import defaultdict
import heapq

def find_itinerary(tickets):
    graph = defaultdict(list)
    for src, dst in tickets:
        heapq.heappush(graph[src], dst)

    itinerary = []
    def dfs(node):
        while graph[node]:
            nb = heapq.heappop(graph[node])
            dfs(nb)
        itinerary.append(node)

    dfs("JFK")
    return itinerary[::-1]
```

**Complexity**
- **Time:** O(E log E). Heap-pop per edge.
- **Space:** O(E).

### Why it works
In an Eulerian path, you may hit dead ends along the way. Hierholzer's handles this by building the path in reverse: when you can't move forward, the current node is part of the *end* of the final path. Appending in post-order then reversing gives the full traversal.

## Approach 3: Hierholzer's with sorted adjacency lists + pointer

Same idea; sort adjacency lists once and iterate with a pointer instead of repeatedly popping from a heap.

```python
from collections import defaultdict

def find_itinerary(tickets):
    graph = defaultdict(list)
    for src, dst in sorted(tickets, reverse=True):
        graph[src].append(dst)   # reversed order so pop() is cheapest

    itinerary = []
    stack = ["JFK"]
    while stack:
        while graph[stack[-1]]:
            stack.append(graph[stack[-1]].pop())
        itinerary.append(stack.pop())
    return itinerary[::-1]
```

**Complexity**
- **Time:** O(E log E) for the sort.
- **Space:** O(E).

Iterative form avoids recursion depth concerns.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute-force backtracking | O(E^E) | O(E) |
| **Hierholzer's + heap** | **O(E log E)** | **O(E)** |
| **Hierholzer's iterative + sort** | **O(E log E)** | **O(E)** |

Hierholzer's is the canonical answer. The "build in reverse" trick is subtle; recognizing it is the whole problem.

## Related data structures

- [Graphs](../../../data-structures/graphs/), Eulerian path; Hierholzer's algorithm
- [Heaps / Priority Queues](../../../data-structures/heaps/), lexicographic neighbor selection
