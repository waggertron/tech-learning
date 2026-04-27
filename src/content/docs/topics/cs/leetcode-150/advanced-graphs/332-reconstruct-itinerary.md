---
title: "332. Reconstruct Itinerary (Hard)"
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
    for src, dst in sorted(tickets):                  # L1: O(E log E) sort
        graph[src].append(dst)                        # L2: O(1) amortized per append

    target_len = len(tickets) + 1                     # L3: O(1)

    def dfs(node, path):
        if len(path) == target_len:                   # L4: O(1) base case check
            return list(path)
        for i, nb in enumerate(graph[node]):          # L5: iterate over neighbors
            if nb is None:
                continue
            graph[node][i] = None                     # L6: O(1) mark used
            path.append(nb)                           # L7: O(1) amortized
            result = dfs(nb, path)                    # L8: recurse
            if result:
                return result
            path.pop()                                # L9: O(1) backtrack
            graph[node][i] = nb                       # L10: O(1) restore
        return None

    return dfs("JFK", ["JFK"])
```

**Where the time goes, line by line**

*Variables: V = number of unique airports, E = len(tickets).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (sort tickets) | O(E log E) | 1 | O(E log E) |
| L2 (build graph) | O(1) | E | O(E) |
| **L5/L8 (backtrack DFS)** | **O(E)** | **up to E^E** | **O(E^E)** ← dominates |
| L6/L10 (mark/restore) | O(1) | per call | O(E^E) |

At each step, up to E tickets could be chosen; with E steps total, the search tree has up to E^E leaves. In practice, lexicographic sorting prunes this heavily, but the worst case is still exponential.

**Complexity**
- **Time:** O(E^E) worst case, driven by L5/L8 (unconstrained backtracking over all permutations).
- **Space:** O(E) for the recursion stack and path.

## Approach 2: Hierholzer's algorithm with lexicographic neighbor selection (optimal)

Hierholzer's builds an Eulerian path in O(E). The trick: always recurse into the **lexicographically smallest** outgoing edge, then prepend the current node to the result as the recursion unwinds.

```python
from collections import defaultdict
import heapq

def find_itinerary(tickets):
    graph = defaultdict(list)
    for src, dst in tickets:
        heapq.heappush(graph[src], dst)               # L1: O(log E) per push; total O(E log E)

    itinerary = []
    def dfs(node):
        while graph[node]:                            # L2: loop until no more edges from this node
            nb = heapq.heappop(graph[node])           # L3: O(log E) pop smallest neighbor
            dfs(nb)                                   # L4: recurse; each edge visited exactly once
        itinerary.append(node)                        # L5: O(1), post-order append

    dfs("JFK")
    return itinerary[::-1]                            # L6: O(E) reverse to get forward path
```

**Where the time goes, line by line**

*Variables: V = number of unique airports, E = len(tickets).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (build heaps) | O(log E) | E | O(E log E) |
| L2 (while loop) | O(1) | E total across all calls | O(E) |
| **L3 (heappop)** | **O(log E)** | **E** | **O(E log E)** ← dominates |
| L4 (recurse) | O(1) overhead | E (one per edge) | O(E) |
| L5 (append) | O(1) | V + E | O(E) |
| L6 (reverse) | O(E) | 1 | O(E) |

Each ticket is a directed edge used exactly once, so the total number of heappop calls equals E. Each pop costs O(log E). Every other operation is O(E) total. The heap overhead from building at L1 is also O(E log E).

**Complexity**
- **Time:** O(E log E), driven by L1/L3 (heap construction and per-edge pops).
- **Space:** O(E) for the heap entries plus the recursion stack (depth up to E in degenerate cases).

### Why it works
In an Eulerian path, you may hit dead ends along the way. Hierholzer's handles this by building the path in reverse: when you can't move forward, the current node is part of the *end* of the final path. Appending in post-order then reversing gives the full traversal.

## Approach 3: Hierholzer's with sorted adjacency lists + pointer

Same idea; sort adjacency lists once and iterate with a pointer instead of repeatedly popping from a heap.

```python
from collections import defaultdict

def find_itinerary(tickets):
    graph = defaultdict(list)
    for src, dst in sorted(tickets, reverse=True):
        graph[src].append(dst)                        # L1: O(E log E) for sort; O(1) per append

    itinerary = []
    stack = ["JFK"]                                   # L2: O(1), explicit stack replaces recursion
    while stack:                                      # L3: outer loop, runs E+1 times total
        while graph[stack[-1]]:                       # L4: inner loop, pops one edge per iteration
            stack.append(graph[stack[-1]].pop())      # L5: O(1) list pop from end + stack push
        itinerary.append(stack.pop())                 # L6: O(1), node has no more outgoing edges
    return itinerary[::-1]                            # L7: O(E) reverse

```

**Where the time goes, line by line**

*Variables: V = number of unique airports, E = len(tickets).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (sort + build)** | **O(E log E)** | **1** | **O(E log E)** ← dominates |
| L3 (outer loop) | O(1) | E+V | O(E) |
| L4/L5 (inner pop+push) | O(1) | E | O(E) |
| L6 (append to result) | O(1) | E+1 | O(E) |
| L7 (reverse) | O(E) | 1 | O(E) |

Sorting once at L1 is the only super-linear step. Everything after is amortized O(1) per edge because each edge is pushed and popped exactly once from both `graph[...]` and `stack`.

**Complexity**
- **Time:** O(E log E) for the sort at L1; all subsequent operations are O(E).
- **Space:** O(E) for the adjacency lists and stack.

Iterative form avoids recursion depth concerns.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute-force backtracking | O(E^E) | O(E) |
| **Hierholzer's + heap** | **O(E log E)** | **O(E)** |
| **Hierholzer's iterative + sort** | **O(E log E)** | **O(E)** |

Hierholzer's is the canonical answer. The "build in reverse" trick is subtle; recognizing it is the whole problem.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_332.py and run.
# Uses the canonical implementation (Hierholzer's iterative, Approach 3).

from collections import defaultdict

def find_itinerary(tickets):
    graph = defaultdict(list)
    for src, dst in sorted(tickets, reverse=True):
        graph[src].append(dst)
    itinerary = []
    stack = ["JFK"]
    while stack:
        while graph[stack[-1]]:
            stack.append(graph[stack[-1]].pop())
        itinerary.append(stack.pop())
    return itinerary[::-1]

def _run_tests():
    # Example 1 from problem statement
    assert find_itinerary([["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]) == ["JFK","MUC","LHR","SFO","SJC"]
    # Example 2: multiple valid itineraries, pick lexicographically smallest
    assert find_itinerary([["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]) == ["JFK","ATL","JFK","SFO","ATL","SFO"]
    # Single ticket
    assert find_itinerary([["JFK","ATL"]]) == ["JFK","ATL"]
    # Linear chain
    assert find_itinerary([["JFK","A"],["A","B"],["B","C"]]) == ["JFK","A","B","C"]
    # Loop back to start
    assert find_itinerary([["JFK","ATL"],["ATL","JFK"]]) == ["JFK","ATL","JFK"]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Graphs](../../../data-structures/graphs/), Eulerian path; Hierholzer's algorithm
- [Heaps / Priority Queues](../../../data-structures/heaps/), lexicographic neighbor selection
