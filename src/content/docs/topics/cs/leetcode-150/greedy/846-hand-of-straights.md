---
title: "846. Hand of Straights"
description: Determine whether a hand of cards can be rearranged into groups of consecutive runs of size k.
parent: greedy
tags: [leetcode, neetcode-150, greedy, hash-tables, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array `hand` of integers (each a card value) and an integer `groupSize`, return `true` if the cards can be rearranged into groups each of which is a run of `groupSize` consecutive values.

**Example**
- `hand = [1,2,3,6,2,3,4,7,8]`, `groupSize = 3` → `true` ([1,2,3], [2,3,4], [6,7,8])
- `hand = [1,2,3,4,5]`, `groupSize = 4` → `false`

LeetCode 846 · [Link](https://leetcode.com/problems/hand-of-straights/) · *Medium*

## Approach 1: Brute force — try every partitioning

Exponential. Skip.

## Approach 2: Sort + per-smallest consumption (canonical greedy)

Count occurrences. Repeatedly take the smallest remaining value `x`; it must start a run of `x, x+1, ..., x + k - 1` — remove one of each. If at any point you can't, return false.

```python
from collections import Counter

def is_n_straight_hand(hand, group_size):
    if len(hand) % group_size != 0:
        return False
    counts = Counter(hand)
    for x in sorted(counts):
        c = counts[x]
        if c == 0:
            continue
        for k in range(group_size):
            if counts[x + k] < c:
                return False
            counts[x + k] -= c
    return True
```

**Complexity**
- **Time:** O(n log n + n · k).
- **Space:** O(n).

## Approach 3: Min-heap + lazy consumption

Min-heap of remaining values; pop smallest; consume one of each of the next k values.

```python
import heapq
from collections import Counter

def is_n_straight_hand(hand, group_size):
    if len(hand) % group_size != 0:
        return False
    counts = Counter(hand)
    heap = list(counts)
    heapq.heapify(heap)
    while heap:
        x = heap[0]
        if counts[x] == 0:
            heapq.heappop(heap)
            continue
        for k in range(group_size):
            if counts[x + k] == 0:
                return False
            counts[x + k] -= 1
        while heap and counts[heap[0]] == 0:
            heapq.heappop(heap)
    return True
```

**Complexity**
- **Time:** O(n log n + n · k).
- **Space:** O(n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate partitions | exponential | O(n) |
| **Sort + per-smallest** | **O(n log n + n · k)** | **O(n)** |
| Min-heap + lazy | O(n log n + n · k) | O(n) |

The greedy choice — always start the next group from the smallest remaining value — is forced: if the smallest value can't start a group, no group can contain it, so the answer is false.

## Related data structures

- [Hash Tables](../../../data-structures/hash-tables/) — frequency counts (Counter)
- [Heaps / Priority Queues](../../../data-structures/heaps/) — smallest-first consumption
