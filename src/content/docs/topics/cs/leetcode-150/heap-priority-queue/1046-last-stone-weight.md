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

## Worked traces

The algorithm only ever cares about the two largest weights at each step. Watching the heap shrink (or annihilate) round by round is the fastest way to see why a max-heap is the natural fit. Each row below shows the multiset of stones (sorted descending for readability) and the action taken.

### Trace 1: `[2,7,4,1,8,1]` → `1` (the canonical case)

```
heap (desc)        action                       result
[8,7,4,2,1,1]      pop 8,7  →  push 8-7=1      [4,2,1,1,1]
[4,2,1,1,1]        pop 4,2  →  push 4-2=2      [2,1,1,1,1]
[2,1,1,1,1]        pop 2,1  →  push 2-1=1      [1,1,1,1]
[1,1,1,1]          pop 1,1  →  equal, destroy  [1,1]
[1,1]              pop 1,1  →  equal, destroy  []
```

Wait, that ends at `[]`, not `[1]`. Recount the input: `[2,7,4,1,8,1]` has six stones. After round 1 there are five, after round 2 four, after round 3 three. So:

```
heap (desc)        action                       result        size
[8,7,4,2,1,1]      pop 8,7  →  push 1          [4,2,1,1,1]   5
[4,2,1,1,1]        pop 4,2  →  push 2          [2,1,1,1,1]   4
[2,1,1,1,1]        pop 2,1  →  push 1          [1,1,1,1]     3
[1,1,1,1]          pop 1,1  →  destroy         [1,1]         1
```

Returns `1`. The trick is that an annihilation step removes **two** elements, not one, so the size jumps by 2 instead of 1.

### Trace 2: `[31,26,33,21,40]` → `9` (no annihilations)

When all the differences are nonzero, the heap shrinks by exactly one per round and the final survivor is whatever weight is left after `n - 1` subtractions.

```
heap (desc)        action                       result
[40,33,31,26,21]   pop 40,33  →  push 7        [31,26,21,7]
[31,26,21,7]       pop 31,26  →  push 5        [21,7,5]
[21,7,5]           pop 21,7   →  push 14       [14,5]
[14,5]             pop 14,5   →  push 9        [9]
```

Returns `9`. Five stones, four rounds, one survivor.

### Trace 3: `[9,3,2,10]` → `0` (chain of annihilations)

Pairs that happen to be equal vanish entirely. With a small input, two consecutive annihilations can clear the heap completely.

```
heap (desc)        action                       result
[10,9,3,2]         pop 10,9  →  push 1         [3,2,1]
[3,2,1]            pop 3,2   →  push 1         [1,1]
[1,1]              pop 1,1   →  destroy        []
```

Returns `0`. Notice how the two pushed `1`s collide in the next round, an emergent property the algorithm doesn't plan for, it just falls out of always taking the two largest.

### What the traces reveal

- **The only state that matters is the multiset of weights.** Order, history, and identity are irrelevant. That's the signature of a problem that wants a heap.
- **Each round is O(log n) reads + O(log n) writes.** Three operations on a heap (two pops, optional push), no scanning, no indexing.
- **The algorithm never looks ahead.** It can't tell whether a push will produce an annihilation later. Greedy on the two largest is enough.

## Approach 1: Brute force, sort each round

Each round, re-sort the whole array, pop the two largest off the end, compute the remainder, append it back.

```python
def last_stone_weight(stones):
    while len(stones) > 1:    # L1: outer loop, runs up to n-1 times
        stones.sort()         # L2: O(n log n) per round
        y = stones.pop()      # L3: O(1) (pop from end)
        x = stones.pop()      # L4: O(1) (pop from end)
        if x != y:
            stones.append(y - x)  # L5: O(1) amortized
    return stones[0] if stones else 0
```

**Where the time goes, line by line**

*Variables: n = number of stones in the input array.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (loop test) | O(1) | n-1 | O(n) |
| **L2 (sort)** | **O(n log n)** | **up to n-1** | **O(n² log n)** ← dominates |
| L3, L4 (pops) | O(1) each | n-1 each | O(n) |
| L5 (append) | O(1) amortized | up to n-1 | O(n) |

The whole story is L2. Sorting an array of size n costs O(n log n), and we do it once per round. Annihilation rounds shrink the array faster, but the worst case (no annihilations) still gives n-1 rounds, so the total is O(n × n log n) = **O(n² log n)**.

A common optimization people propose is sorting once and using `bisect.insort` for the new stone, which would give O(n²) total (insertion is O(n) due to shifting). Still asymptotically worse than the heap.

**Complexity**
- **Time:** O(n² log n), driven entirely by L2.
- **Space:** O(1) extra (sort is in-place; pops and appends don't grow the array beyond its starting capacity).

## Approach 2: Max-heap (optimal)

Python's `heapq` is a min-heap. Negate every weight on the way in and out and you get a max-heap for free.

```python
import heapq

def last_stone_weight(stones):
    heap = [-s for s in stones]            # L1: O(n)
    heapq.heapify(heap)                    # L2: O(n) (Floyd's bottom-up)
    while len(heap) > 1:                   # L3: outer loop, up to n-1 rounds
        y = -heapq.heappop(heap)           # L4: O(log n) per call
        x = -heapq.heappop(heap)           # L5: O(log n) per call
        if x != y:
            heapq.heappush(heap, -(y - x)) # L6: O(log n) when taken
    return -heap[0] if heap else 0
```

**Where the time goes, line by line**

*Variables: n = number of stones in the input array.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (negate list) | O(1) | n | O(n) |
| L2 (heapify) | O(n) | 1 | O(n) |
| L3 (loop test) | O(1) | n-1 | O(n) |
| **L4, L5 (pops)** | **O(log n)** | **n-1 each** | **O(n log n)** ← dominates |
| L6 (push) | O(log n) | up to n-1 | O(n log n) |

Two important details that often trip people up:

- **`heapify` is O(n), not O(n log n).** Floyd's bottom-up construction sifts each node down toward the leaves, and the total work across the whole tree is bounded by a geometric series that sums to O(n). Building the heap is cheaper than maintaining it.
- **Each round does at most three O(log n) operations.** Two pops, one optional push. We never scan, never re-sort, never index into the middle.

Since we do n-1 rounds and each round is O(log n), the running total is **O(n log n)**, dominated by L4/L5/L6.

**Complexity**
- **Time:** O(n log n), driven by L4/L5/L6 (the three heap operations inside the loop).
- **Space:** O(n) for the negated heap. The original `stones` is left untouched.

## Approach 3: SortedList (identical complexity, cleaner for two-ended access)

`sortedcontainers.SortedList` is a B+ tree of small sorted buckets. Add and remove are O(log n) at either end, and indexed access is O(log n) anywhere.

```python
from sortedcontainers import SortedList

def last_stone_weight(stones):
    sl = SortedList(stones)   # L1: O(n log n) (sorts on construction)
    while len(sl) > 1:        # L2: outer loop, up to n-1 rounds
        y = sl.pop()          # L3: O(log n) per call (pop from end)
        x = sl.pop()          # L4: O(log n) per call
        if x != y:
            sl.add(y - x)     # L5: O(log n) when taken
    return sl[0] if sl else 0
```

**Where the time goes, line by line**

*Variables: n = number of stones in the input array.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (construct SortedList) | O(n log n) | 1 | O(n log n) |
| L2 (loop test) | O(1) | n-1 | O(n) |
| **L3, L4 (pops)** | **O(log n)** | **n-1 each** | **O(n log n)** |
| L5 (add) | O(log n) | up to n-1 | O(n log n) |

Same total as the heap, but L1 alone already costs O(n log n), so construction is no cheaper than the work it saves. The win over the heap is purely ergonomic: no negation trick, and you keep O(log n) middle-index access in case the problem variant needs it.

Not in the standard library, so depending on the LeetCode environment you may or may not have it available.

**Complexity**
- **Time:** O(n log n), with L1 and the inner loop both contributing O(n log n).
- **Space:** O(n) for the sorted structure.

## Summary

| Approach | Time | Space | Bottleneck |
| --- | --- | --- | --- |
| Sort each round | O(n² log n) | O(1) | L2: re-sorting every round |
| **Max-heap (via negation)** | **O(n log n)** | **O(n)** | **L4/L5/L6: per-round heap ops** |
| SortedList | O(n log n) | O(n) | L1 + L3/L4/L5: construction and per-round ops |

Simulation problems with dynamic priority almost always want a heap. The brute-force version is a good baseline because it makes the "what does each round actually cost?" question impossible to ignore: if your inner-loop step is O(n log n), you've already lost a factor of n that a heap would have saved.

## Test cases

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

def _run_tests():
    assert last_stone_weight([2, 7, 4, 1, 8, 1]) == 1     # canonical: ends at 1
    assert last_stone_weight([1]) == 1                     # single stone
    assert last_stone_weight([31, 26, 33, 21, 40]) == 9    # no annihilations
    assert last_stone_weight([9, 3, 2, 10]) == 0           # chain of annihilations
    assert last_stone_weight([2, 2]) == 0                  # immediate annihilation
    assert last_stone_weight([1, 3]) == 2                  # one round, no destroy
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/), max-heap via negated min-heap
