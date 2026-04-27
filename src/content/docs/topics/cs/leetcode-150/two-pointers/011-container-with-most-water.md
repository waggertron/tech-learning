---
title: "11. Container With Most Water"
description: "Given an array of heights, find two lines that together with the x-axis form a container holding the most water."
parent: two-pointers
tags: [leetcode, neetcode-150, arrays, two-pointers, greedy, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`. Find two lines that, together with the x-axis, form a container that holds the most water. Return the maximum amount of water.

The area is `min(height[l], height[r]) × (r - l)`.

**Example**
- `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]` → `49`
- `height = [1, 1]` → `1`

LeetCode 11 · [Link](https://leetcode.com/problems/container-with-most-water/) · *Medium*

## Approach 1: Brute force, every pair

Check every `(l, r)` pair and track the max area.

```python
def max_area(height: list[int]) -> int:
    n = len(height)                                    # L1: O(1)
    best = 0                                           # L2: O(1)
    for l in range(n):                                 # L3: outer loop, n iterations
        for r in range(l + 1, n):                      # L4: inner loop, n-l-1 iterations
            area = min(height[l], height[r]) * (r - l) # L5: O(1) area computation
            best = max(best, area)                     # L6: O(1) update
    return best
```

**Where the time goes, line by line**

*Variables: n = len(height).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1, L2 (init) | O(1) | 1 | O(1) |
| L3 (outer loop) | O(1) | n | O(n) |
| **L4, L5, L6 (inner loop + area)** | **O(1)** | **~n²/2** | **O(n²)** ← dominates |

Every pair (l, r) with l < r is evaluated; there are n*(n-1)/2 such pairs.

**Complexity**
- **Time:** O(n²), driven by L4/L5 (nested loop area computations).
- **Space:** O(1).

Too slow for `n ≤ 10⁵`.

## Approach 2: Two pointers, greedy convergence (optimal)

Start with pointers at both ends. Compute the area; then move the pointer with the **shorter** height inward. Continue until the pointers meet.

```python
def max_area(height: list[int]) -> int:
    l, r = 0, len(height) - 1           # L1: O(1) init pointers
    best = 0                             # L2: O(1)
    while l < r:                         # L3: loop, at most n iterations total
        area = min(height[l], height[r]) * (r - l)  # L4: O(1) area
        best = max(best, area)           # L5: O(1) update
        if height[l] < height[r]:        # L6: O(1) compare
            l += 1                       # L7: O(1) advance left
        else:
            r -= 1                       # L8: O(1) advance right
    return best
```

**Where the time goes, line by line**

*Variables: n = len(height).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1, L2 (init) | O(1) | 1 | O(1) |
| L3 (loop condition) | O(1) | n | O(n) |
| **L4, L5 (area + update)** | **O(1)** | **n** | **O(n)** ← dominates |
| L6-L8 (move pointer) | O(1) | n | O(n) |

Each iteration advances either `l` or `r` by one; together they start n-1 apart and meet, so exactly n-1 iterations occur.

**Complexity**
- **Time:** O(n), driven by L4/L5 (one area computation per pointer step). Each pointer moves inward monotonically; total work is linear.
- **Space:** O(1).

### Why it's correct (proof sketch)
At each step the container has width `r - l` and height `min(height[l], height[r])`. Moving the **taller** side inward can never produce a larger area with the current shorter side, the width shrinks while the height can't exceed the current shorter side. Therefore the shorter side can only limit future answers in combination with itself, and we can safely discard it by moving its pointer. This preserves the optimum in the remaining search space.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n²) | O(1) |
| **Two pointers** | **O(n)** | **O(1)** |

This is a case where the problem jumps from O(n²) brute force straight to O(n) optimal, there's no meaningful middle tier. The insight is the convergence proof above; once you see it, the solution falls out.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_container_with_most_water.py and run.
# Uses the canonical implementation (Approach 2: two pointers).

def max_area(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    best = 0
    while l < r:
        area = min(height[l], height[r]) * (r - l)
        best = max(best, area)
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return best

def _run_tests():
    assert max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49
    assert max_area([1, 1]) == 1
    assert max_area([1, 2, 1]) == 2
    assert max_area([4, 3, 2, 1, 4]) == 16
    assert max_area([1, 2, 4, 3]) == 4
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), two pointers on a bounded array, greedy inward movement
