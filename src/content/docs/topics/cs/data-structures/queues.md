---
title: Queues
description: FIFO (first-in, first-out) structure, the engine of BFS and level-order traversal. Variants include deques, priority queues, and circular buffers.
parent: data-structures
tags: [data-structures, queues, bfs, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

A queue is a **FIFO** (first-in, first-out) collection. You enqueue at one end and dequeue from the other. The standard queue API is `enqueue`, `dequeue`, `peek`, all O(1). Queues power BFS (and therefore shortest-path-on-unweighted-graphs), level-order traversals, task scheduling, and many streaming-window problems.

## In-depth description

A queue can be implemented with a **linked list** (head and tail pointers) or a **circular buffer** backed by a dynamic array (wrap-around head/tail indices). The naive array-based queue, pop from index 0, is O(n) per dequeue, which is why Python `list` is not a queue. Use `collections.deque`, which is O(1) on both ends via a doubly-linked list of array blocks.

Key variants:

- **Deque** (double-ended queue), O(1) push/pop at both ends. The substrate for the **monotonic deque** pattern, which solves sliding-window maximum / minimum in O(n) instead of the naive O(n·k).
- **Priority queue**, dequeues elements by priority, not arrival order. Usually implemented with a heap (see [Heaps](../heaps/)).
- **Circular buffer**, fixed-size array with wrap-around head and tail indices; used for ring buffers, rate limiters, and streaming windows.

Queues are the engine of **BFS**, which in turn solves:

- Shortest path in an unweighted graph (each edge counts as 1).
- Level-order traversal of a tree.
- Multi-source BFS (seed the queue with all sources simultaneously), used for Rotten Oranges, Walls and Gates, 01 Matrix.

## Time complexity

| Operation | Average | Worst |
| --- | --- | --- |
| Enqueue | O(1) | O(1) |
| Dequeue | O(1) | O(1) |
| Peek (front) | O(1) | O(1) |
| Search by value | O(n) | O(n) |
| Space | O(n) | O(n) |

## Common uses in DSA

1. **BFS / level-order traversal**, Binary Tree Level Order Traversal, Number of Islands, Shortest Path in Binary Matrix, Word Ladder.
2. **Sliding window maximum / minimum**, via a monotonic deque, O(n).
3. **Multi-source BFS**, Rotten Oranges, Walls and Gates, 01 Matrix (seed queue with all sources at distance 0).
4. **Task scheduling and interval problems**, Task Scheduler, Design Hit Counter, Moving Average from Data Stream.
5. **Producer-consumer / streaming buffers**, circular buffers for rate limiters, ring buffers in systems code, bounded channels.

**Canonical LeetCode problems:** #200 Number of Islands, #239 Sliding Window Maximum, #542 01 Matrix, #621 Task Scheduler, #994 Rotting Oranges.

## Python example

```python
from collections import deque

# Basic FIFO
q = deque()
q.append(1)          # enqueue at right
q.append(2)
q.append(3)
q.popleft()          # dequeue from left -> 1

# Deque: O(1) at both ends
d = deque([1, 2, 3])
d.appendleft(0)      # [0, 1, 2, 3]
d.pop()              # [0, 1, 2]  (removes from right)

# BFS template on a graph
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

# Sliding window maximum (monotonic deque, O(n))
def max_sliding_window(nums, k):
    dq, result = deque(), []
    for i, x in enumerate(nums):
        while dq and dq[0] <= i, k:
            dq.popleft()
        while dq and nums[dq[-1]] < x:
            dq.pop()
        dq.append(i)
        if i >= k, 1:
            result.append(nums[dq[0]])
    return result
```

## LeetCode problems

Queues (and deques) appear in 12 NeetCode 150 problems across 5 categories.

**Sliding Window:**
- [239. Sliding Window Maximum](../../leetcode-150/sliding-window/239-sliding-window-maximum/), monotonic deque

**Trees:**
- [102. Binary Tree Level Order Traversal](../../leetcode-150/trees/102-binary-tree-level-order-traversal/), BFS per-level batching
- [104. Maximum Depth of Binary Tree](../../leetcode-150/trees/104-maximum-depth-of-binary-tree/), BFS level count
- [199. Binary Tree Right Side View](../../leetcode-150/trees/199-binary-tree-right-side-view/)
- [297. Serialize and Deserialize Binary Tree](../../leetcode-150/trees/297-serialize-and-deserialize-binary-tree/), BFS with null markers

**Heap / Priority Queue:**
- [621. Task Scheduler](../../leetcode-150/heap-priority-queue/621-task-scheduler/), cooldown FIFO + max-heap

**Graphs:**
- [127. Word Ladder](../../leetcode-150/graphs/127-word-ladder/), BFS
- [133. Clone Graph](../../leetcode-150/graphs/133-clone-graph/), BFS variant
- [200. Number of Islands](../../leetcode-150/graphs/200-number-of-islands/), BFS on grid
- [695. Max Area of Island](../../leetcode-150/graphs/695-max-area-of-island/), BFS variant
- [994. Rotting Oranges](../../leetcode-150/graphs/994-rotting-oranges/), multi-source BFS

**2-D Dynamic Programming:**
- [329. Longest Increasing Path in a Matrix](../../leetcode-150/2d-dynamic-programming/329-longest-increasing-path-in-a-matrix/), topological BFS variant

## References

- [Queue, Wikipedia](https://en.wikipedia.org/wiki/Queue_(abstract_data_type))
- [Python collections.deque](https://docs.python.org/3/library/collections.html#collections.deque)
- [Monotonic deque pattern, LeetCode](https://leetcode.com/problems/sliding-window-maximum/)
- [BFS introduction, cp-algorithms](https://cp-algorithms.com/graph/breadth-first-search.html)
