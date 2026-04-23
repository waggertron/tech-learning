---
title: "11. Container With Most Water"
description: Given an array of heights, find two lines that together with the x-axis form a container holding the most water.
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

## Approach 1: Brute force — every pair

Check every `(l, r)` pair and track the max area.

```python
def max_area(height: list[int]) -> int:
    n = len(height)
    best = 0
    for l in range(n):
        for r in range(l + 1, n):
            area = min(height[l], height[r]) * (r - l)
            best = max(best, area)
    return best
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

Too slow for `n ≤ 10⁵`.

## Approach 2: Two pointers — greedy convergence (optimal)

Start with pointers at both ends. Compute the area; then move the pointer with the **shorter** height inward. Continue until the pointers meet.

```python
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
```

**Complexity**
- **Time:** O(n). Each pointer moves inward monotonically; total work is linear.
- **Space:** O(1).

### Why it's correct (proof sketch)
At each step the container has width `r - l` and height `min(height[l], height[r])`. Moving the **taller** side inward can never produce a larger area with the current shorter side — the width shrinks while the height can't exceed the current shorter side. Therefore the shorter side can only limit future answers in combination with itself, and we can safely discard it by moving its pointer. This preserves the optimum in the remaining search space.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n²) | O(1) |
| **Two pointers** | **O(n)** | **O(1)** |

This is a case where the problem jumps from O(n²) brute force straight to O(n) optimal — there's no meaningful middle tier. The insight is the convergence proof above; once you see it, the solution falls out.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — two pointers on a bounded array, greedy inward movement
