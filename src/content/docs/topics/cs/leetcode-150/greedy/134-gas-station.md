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
    n = len(gas)                                # L1: O(1)
    for start in range(n):                      # L2: outer loop, n starts
        tank = 0
        for i in range(n):                      # L3: inner loop, n steps per start
            idx = (start + i) % n               # L4: O(1)
            tank += gas[idx] - cost[idx]        # L5: O(1)
            if tank < 0:
                break
        else:
            return start
    return -1
```

**Where the time goes, line by line**

*Variables: n = len(gas) = len(cost).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (outer loop) | O(1) | n | O(n) |
| **L3-L5 (inner simulation)** | **O(1)** | **up to n per start** | **O(n²)** ← dominates |

For each candidate start, we simulate up to `n` steps; worst case all `n` starts are tried fully.

**Complexity**
- **Time:** O(n²), driven by L3/L4/L5 (full simulation per candidate start).
- **Space:** O(1).

## Approach 2: Greedy single pass (canonical)

Two facts:

1. If `sum(gas) < sum(cost)`, no start works.
2. Otherwise, walking from the earliest index where cumulative `gas - cost` stays non-negative succeeds.

```python
def can_complete_circuit(gas, cost):
    if sum(gas) < sum(cost):                # L1: O(n) feasibility check
        return -1
    tank = 0                                # L2: O(1)
    start = 0                               # L3: O(1)
    for i in range(len(gas)):               # L4: single pass, n iterations
        tank += gas[i] - cost[i]            # L5: O(1)
        if tank < 0:                        # L6: O(1)
            start = i + 1
            tank = 0
    return start
```

**Where the time goes, line by line**

*Variables: n = len(gas) = len(cost).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (sum check) | O(n) | 1 | O(n) |
| **L4-L6 (single pass)** | **O(1)** | **n** | **O(n)** ← dominates |

Two O(n) passes (one for the sum check, one for the greedy scan); both are O(n) total.

**Complexity**
- **Time:** O(n), driven by L4/L5/L6 (the single greedy scan, plus the O(n) sum check at L1).
- **Space:** O(1).

### Why this works
If you run out of gas between stations `start` and `j`, then no station in `[start, j]` can be a valid start, your cumulative deficit proves each of them fails before reaching `j`. So you can safely jump to `j + 1`. One linear pass suffices.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Try every start | O(n²) | O(1) |
| **Greedy single pass** | **O(n)** | **O(1)** |

Classic "skip impossible prefixes" greedy.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_134.py and run.
# Uses the canonical implementation (Approach 2: greedy single pass).

def can_complete_circuit(gas, cost):
    if sum(gas) < sum(cost):
        return -1
    tank = 0
    start = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start

def _run_tests():
    assert can_complete_circuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]) == 3
    assert can_complete_circuit([2, 3, 4], [3, 4, 3]) == -1
    assert can_complete_circuit([1], [1]) == 0     # single station, exact balance
    assert can_complete_circuit([5], [4]) == 0     # single station with surplus
    assert can_complete_circuit([2, 0, 1], [0, 1, 2]) == 0  # start at 0
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), running tank balance
