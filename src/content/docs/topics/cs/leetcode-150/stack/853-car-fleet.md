---
title: "853. Car Fleet"
description: "Count the number of fleets that arrive at a target destination, where a faster car behind a slower one merges into a single fleet."
parent: stack
tags: [leetcode, neetcode-150, arrays, stacks, sorting, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

There are `n` cars driving to the same `target`. The i-th car is at `position[i]` with speed `speed[i]`. A faster car behind a slower one can never pass; it slows down to the slower car's speed and they become a **fleet**. A fleet is a non-empty set of cars driving at the same position with the same speed. A car that catches up to a fleet *at the exact target* also counts as merging.

Return the number of fleets that arrive at `target`.

**Example**
- `target = 12`, `position = [10,8,0,5,3]`, `speed = [2,4,1,1,3]` → `3`
- `target = 10`, `position = [3]`, `speed = [3]` → `1`

LeetCode 853 · [Link](https://leetcode.com/problems/car-fleet/) · *Medium*

## Approach 1: Brute force, step-wise simulation

Simulate every time step, updating positions and collapsing cars that meet.

```python
def car_fleet(target: int, position: list[int], speed: list[int]) -> int:
    # Fragile, slow, and fiddly with floating point. Included for contrast.
    cars = sorted(zip(position, speed))
    # ... step positions, merge when adjacent positions equalize, etc.
    # In practice this is buggy; don't do it.
    raise NotImplementedError("Simulation is not recommended for this problem.")
```

**Where the time goes, line by line**

*Variables: n = len(position), T = simulation time horizon.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **sort + simulate** | **O(n) per step** | **T steps** | **O(n · T)** ← dominates |

T is unbounded in general and may involve floating-point precision issues.

**Complexity**
- **Time:** Hard to bound cleanly; effectively O(n · T) where T is the simulation horizon.
- **Space:** O(n).

Don't actually simulate, it's imprecise and slow.

## Approach 2: Sort by position descending; compute arrival times

Sort cars by their starting position, nearest-to-target first. Compute each car's time to reach the target (assuming free travel). A new fleet forms whenever a car arrives strictly later than the fleet ahead of it; otherwise it merges.

```python
def car_fleet(target: int, position: list[int], speed: list[int]) -> int:
    cars = sorted(zip(position, speed), reverse=True)  # L1: O(n log n) sort descending
    fleets = 0                                          # L2: O(1)
    last_arrival = 0.0                                  # L3: O(1) arrival of fleet ahead
    for pos, spd in cars:                               # L4: n iterations
        arrival = (target - pos) / spd                  # L5: O(1) time to target
        if arrival > last_arrival:                      # L6: O(1) fleet check
            fleets += 1                                 # L7: O(1) new fleet
            last_arrival = arrival                      # L8: O(1) update
    return fleets                                       # L9: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(position).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (sort)** | **O(n log n)** | **1** | **O(n log n)** ← dominates |
| L4-L8 (linear scan) | O(1) | n | O(n) |

The sort dominates; the scan is linear.

**Complexity**
- **Time:** O(n log n), driven by L1 (sorting by position). Sorting dominates.
- **Space:** O(n) for the sort.

## Approach 3: Sort + monotonic stack of arrival times (equivalent, stack-explicit)

Same ordering, but use a stack of arrival times to make the "merge behind a slower car" more visual: push the car's arrival time; pop it immediately if the stack top (car ahead) arrives later (or equal, since faster cars behind catch up and merge).

```python
def car_fleet(target: int, position: list[int], speed: list[int]) -> int:
    cars = sorted(zip(position, speed), reverse=True)   # L1: O(n log n) sort
    stack = []                                           # L2: O(1)
    for pos, spd in cars:                                # L3: n iterations
        t = (target - pos) / spd                         # L4: O(1) arrival time
        if not stack or t > stack[-1]:                   # L5: O(1) check vs fleet ahead
            stack.append(t)                              # L6: O(1) push new fleet
        # otherwise: catches up to the fleet ahead, merged
    return len(stack)                                    # L7: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(position).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (sort)** | **O(n log n)** | **1** | **O(n log n)** ← dominates |
| L3-L6 (scan + stack ops) | O(1) | n | O(n) |
| L7 (len) | O(1) | 1 | O(1) |

Same cost structure as Approach 2; the stack just makes the fleet grouping explicit.

**Complexity**
- **Time:** O(n log n), driven by L1 (sorting by position).
- **Space:** O(n) for the stack.

Functionally equivalent to Approach 2; the stack makes the fleet structure explicit.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Time-step simulation | O(n · T) | O(n) |
| **Sort + arrival times** | **O(n log n)** | O(n) |
| **Sort + monotonic stack** | **O(n log n)** | O(n) |

The insight: fleets are determined by **arrival times in order of starting position**, no need to simulate. A slower car ahead caps everyone behind it.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_car_fleet.py and run.
# Uses the canonical implementation (Approach 3: sort + monotonic stack).

def car_fleet(target: int, position: list[int], speed: list[int]) -> int:
    cars = sorted(zip(position, speed), reverse=True)
    stack = []
    for pos, spd in cars:
        t = (target - pos) / spd
        if not stack or t > stack[-1]:
            stack.append(t)
    return len(stack)

def _run_tests():
    assert car_fleet(12, [10,8,0,5,3], [2,4,1,1,3]) == 3
    assert car_fleet(10, [3], [3]) == 1
    assert car_fleet(100, [0,2,4], [4,2,1]) == 1  # all merge
    assert car_fleet(10, [6,8], [3,2]) == 2       # car at 8 arrives faster, 2 fleets
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), `(position, speed)` pairs; sort + pass
- [Stacks](../../../data-structures/stacks/), visualization of fleet merges
