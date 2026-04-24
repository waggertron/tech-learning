---
title: "134. Gas Station"
description: Find the starting gas station from which you can complete a circular trip, or return -1.
parent: greedy
tags: [leetcode, neetcode-150, greedy, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You have `n` gas stations arranged in a circle. `gas[i]` is how much gas station `i` provides; `cost[i]` is the gas needed to travel from station `i` to station `i + 1` (circular). You start with an empty tank. Return the starting index if you can make a complete loop, or `-1`.

The answer is unique if it exists.

**Example**
- `gas = [1,2,3,4,5]`, `cost = [3,4,5,1,2]` → `3`
- `gas = [2,3,4]`, `cost = [3,4,3]` → `-1`

LeetCode 134 · [Link](https://leetcode.com/problems/gas-station/) · *Medium*

## Approach 1: Brute force, try every start

For each starting index, simulate the loop.

```python
def can_complete_circuit(gas, cost):
    n = len(gas)
    for start in range(n):
        tank = 0
        for i in range(n):
            idx = (start + i) % n
            tank += gas[idx], cost[idx]
            if tank < 0:
                break
        else:
            return start
    return -1
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

## Approach 2: Greedy single pass (canonical)

Two facts:

1. If `sum(gas) < sum(cost)`, no start works.
2. Otherwise, walking from the earliest index where cumulative `gas, cost` stays non-negative succeeds.

```python
def can_complete_circuit(gas, cost):
    if sum(gas) < sum(cost):
        return -1
    tank = 0
    start = 0
    for i in range(len(gas)):
        tank += gas[i], cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

### Why this works
If you run out of gas between stations `start` and `j`, then no station in `[start, j]` can be a valid start, your cumulative deficit proves each of them fails before reaching `j`. So you can safely jump to `j + 1`. One linear pass suffices.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Try every start | O(n²) | O(1) |
| **Greedy single pass** | **O(n)** | **O(1)** |

Classic "skip impossible prefixes" greedy.

## Related data structures

- [Arrays](../../../data-structures/arrays/), running tank balance
