---
title: "1046. Last Stone Weight"
description: Simulate a collision game on a heap; return the final remaining stone.
parent: heap-priority-queue
tags: [leetcode, neetcode-150, heaps, simulation, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given an array `stones` where each stone has a positive integer weight. Each round:

1. Take the two heaviest stones `x, y` (with `x ≤ y`).
2. If `x == y`, both are destroyed.
3. Otherwise, replace them with a stone of weight `y - x`.

Return the weight of the last remaining stone, or 0 if none remain.

**Example**
- `stones = [2,7,4,1,8,1]` → `1`
- `stones = [1]` → `1`

LeetCode 1046 · [Link](https://leetcode.com/problems/last-stone-weight/) · *Easy*

## Approach 1: Brute force — sort each round

Each round, sort the array, pop the two largest, compute the remainder, append.

```python
def last_stone_weight(stones):
    stones = sorted(stones)
    while len(stones) > 1:
        stones.sort()
        y = stones.pop()
        x = stones.pop()
        if x != y:
            stones.append(y - x)
    return stones[0] if stones else 0
```

**Complexity**
- **Time:** O(n² log n). Sort each round × O(n) rounds.
- **Space:** O(1) extra.

## Approach 2: Max-heap (optimal)

Python's `heapq` is a min-heap; negate values to simulate max-heap.

```python
import heapq

def last_stone_weight(stones):
    heap = [-s for s in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        y = -heapq.heappop(heap)
        x = -heapq.heappop(heap)
        if x != y:
            heapq.heappush(heap, -(y - x))
    return -heap[0] if heap else 0
```

**Complexity**
- **Time:** O(n log n). n rounds × O(log n) pops/pushes.
- **Space:** O(n) heap.

## Approach 3: SortedList (identical complexity, cleaner for two-ended access)

`sortedcontainers.SortedList` gives O(log n) add/remove at either end.

```python
from sortedcontainers import SortedList

def last_stone_weight(stones):
    sl = SortedList(stones)
    while len(sl) > 1:
        y = sl.pop()
        x = sl.pop()
        if x != y:
            sl.add(y - x)
    return sl[0] if sl else 0
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(n).

Not available in the standard library; useful when you also need middle-index access.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Sort each round | O(n² log n) | O(1) |
| **Max-heap (via negation)** | **O(n log n)** | **O(n)** |
| SortedList | O(n log n) | O(n) |

Simulation problems with dynamic priority almost always want a heap.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/) — max-heap via negated min-heap
