---
title: Sentinel Values
description: "A special placeholder planted in a data structure or algorithm to mean 'impossible', 'not found', or 'uninitialized': the three properties a good sentinel must have, and how they appear across DP, shortest-path, search, and linked-list problems."
category: cs
tags: [algorithms, dp, patterns, interviews]
status: draft
created: 2026-05-12
updated: 2026-05-12
---

A sentinel is a value you plant in a data structure to mean something other than a real answer: "this slot is unreachable," "no element here," "I haven't computed this yet." It is not magic. It is a contract you make with yourself so your algorithm can treat every slot uniformly, including the ones that have no valid data yet.

## Why sentinels exist

Without a sentinel, every access needs a branch: is this slot initialized? Is this path reachable? Did I find the element? With a sentinel, the question collapses. The slot always holds a value, and the value tells you whether you have a real answer.

That matters most in two situations:

1. **Table-building algorithms** (DP, shortest path): you fill a table in order and each cell references earlier cells. A sentinel in the "impossible" cells lets the recurrence run without special-casing.
2. **Search results**: callers need to distinguish "found at index 0" from "not found." A sentinel outside the valid range (like `-1` for an index) carries that signal without an extra boolean.

## The three properties of a good sentinel

A sentinel must be:

1. **Outside the valid answer range.** If real answers are always non-negative, `-1` works. If real answers are always at most `n`, then `n + 1` works.
2. **Propagation-safe.** When the sentinel flows through your recurrence, it should stay "impossible." If you are taking `min()`, the sentinel must be large enough that any real answer beats it.
3. **Cheap to check.** You need to test for it at the end. `!= INF`, `== -1`, `is None` are all $O(1)$.

## Common sentinels and where they appear

### `-1`: not found

The most common sentinel in search. Linear search, binary search, and hash-table lookups all return `-1` when the target is missing. Valid indices are always `>= 0`, so `-1` is unambiguously outside the answer range.

```python
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1   # sentinel: target not present
```

### `None`: no node

[Linked lists](../data-structures/linked-lists/) and binary trees terminate with `None`. It is the oldest sentinel in common use. A valid node is always an object, never `None`, so `None` is unambiguously "end of structure."

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next   # None at the tail

def traverse(head):
    curr = head
    while curr is not None:   # sentinel check
        print(curr.val)
        curr = curr.next
```

### `float('inf')`: no path yet

Dijkstra and Floyd-Warshall initialize every distance to `float('inf')`. Any real path cost is finite, so `inf` means "no path found yet." The recurrence `dist[v] = min(dist[v], dist[u] + w)` leaves `inf` in unreachable nodes because no finite path can beat infinity.

```python
import heapq

def dijkstra(graph, src):
    dist = {node: float('inf') for node in graph}   # sentinel for every node
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))
    return dist   # unreachable nodes still hold float('inf')
```

See [Dijkstra's algorithm](../named-algorithms/dijkstra/) for the full walkthrough.

### `amount + 1`: impossible coin count

Coin Change (LeetCode 322) uses `amount + 1` as the sentinel for "this amount is unreachable." The reasoning: you can always make any reachable amount with at most `amount` coins of denomination 1. So `amount + 1` is strictly larger than any valid answer, and `min()` will always prefer a real path over it.

Using `float('inf')` would also work, but `amount + 1` is an integer and produces a tighter bound.

```python
def coin_change(coins, amount):
    INF = amount + 1                    # sentinel: larger than any valid answer
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if c <= i:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != INF else -1
```

Trace with `coins = [2]`, `amount = 3`:

```
dp:  [0, 4, 4, 4]   (initial, sentinel = 4)
i=1: coin 2 > 1, skip        -> dp[1] = 4  (still sentinel)
i=2: min(4, 1+dp[0]) = 1     -> dp[2] = 1
i=3: min(4, 1+dp[1]) = 1+4=5, clamped by min to 4 -> dp[3] = 4  (still sentinel)
return -1   (dp[3] == INF)
```

See [Coin Change](../coding-problems/1d-dynamic-programming/322-coin-change/) for the full walkthrough.

### Grid traversal: visited markers

BFS and DFS on grids often use the grid itself as the sentinel store. Visiting a cell marks it with a sentinel (`'#'`, `0`, or a separate `visited` set) so it will not be re-entered.

```python
def num_islands(grid):
    def dfs(r, c):
        if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]):
            return
        if grid[r][c] != '1':   # sentinel check: water or already visited
            return
        grid[r][c] = '#'        # mark visited
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)

    count = 0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1
    return count
```

See [Number of Islands](../coding-problems/graphs/200-number-of-islands/) for the full walkthrough.

## Picking the right sentinel

| Situation | Good sentinel | Why |
| --- | --- | --- |
| Search result (index) | `-1` | Indices are non-negative |
| Shortest path (distance) | `float('inf')` | Any real path beats it under `min()` |
| DP "impossible" (bounded) | `target + 1` | Tighter than `inf`, stays an integer |
| Tree or list terminator | `None` | Absence of a node is the natural concept |
| Grid visited | `'#'` or separate `set` | Avoids mutating input if purity matters |

Avoid sentinels that can be confused with real answers. If `-1` is a valid result (for example, a problem where profit can be negative), pick a different sentinel or use a separate `Optional` return type.

## References

- [Wikipedia: Sentinel value](https://en.wikipedia.org/wiki/Sentinel_value)
- [CLRS, Introduction to Algorithms](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/), sentinel nodes in linked lists, Chapter 10

## Related topics

- [Coin Change](../coding-problems/1d-dynamic-programming/322-coin-change/), the `amount + 1` sentinel in practice
- [Dijkstra's algorithm](../named-algorithms/dijkstra/), `float('inf')` for unvisited nodes
- [Number of Islands](../coding-problems/graphs/200-number-of-islands/), in-place grid marking
- [Data Structures](../data-structures/), the structures that hold sentinels
