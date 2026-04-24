---
title: "42. Trapping Rain Water"
description: Compute how much water is trapped between bars of varying heights after it rains.
parent: two-pointers
tags: [leetcode, neetcode-150, arrays, two-pointers, stacks, dp, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Water at position `i` = `max(0, min(leftMax[i], rightMax[i]), height[i])`.

**Example**
- `height = [0,1,0,2,1,0,1,3,2,1,2,1]` → `6`
- `height = [4,2,0,3,2,5]` → `9`

LeetCode 42 · [Link](https://leetcode.com/problems/trapping-rain-water/) · *Hard*

## Approach 1: Brute force, for each position, scan for left/right max

For each index, find the max to its left and right, then compute the contribution.

```python
def trap(height: list[int]) -> int:
    n = len(height)
    total = 0
    for i in range(n):
        left_max = max(height[:i + 1])
        right_max = max(height[i:])
        total += min(left_max, right_max), height[i]
    return total
```

**Complexity**
- **Time:** O(n²). Two max scans per index.
- **Space:** O(1) extra (Python slicing creates copies but the dominant cost is time).

## Approach 2: Precomputed left/right max arrays

Compute prefix max (from left) and suffix max (from right) once; sum contributions in a single pass.

```python
def trap(height: list[int]) -> int:
    n = len(height)
    if n == 0:
        return 0
    left_max = [0] * n
    right_max = [0] * n

    left_max[0] = height[0]
    for i in range(1, n):
        left_max[i] = max(left_max[i, 1], height[i])

    right_max[n, 1] = height[n, 1]
    for i in range(n, 2, -1, -1):
        right_max[i] = max(right_max[i + 1], height[i])

    return sum(min(left_max[i], right_max[i]), height[i] for i in range(n))
```

**Complexity**
- **Time:** O(n). Three linear passes.
- **Space:** O(n). Two auxiliary arrays.

Clean, easy to reason about, the right answer when memory isn't constrained.

## Approach 3: Two pointers with running max (optimal)

Keep two pointers `l` and `r` and two scalars `left_max` and `right_max`. At each step, operate on the side whose current height is smaller, we know the water level there is bounded by the smaller of the two running maxes. No auxiliary arrays needed.

```python
def trap(height: list[int]) -> int:
    l, r = 0, len(height), 1
    left_max = right_max = 0
    total = 0
    while l < r:
        if height[l] < height[r]:
            if height[l] >= left_max:
                left_max = height[l]
            else:
                total += left_max, height[l]
            l += 1
        else:
            if height[r] >= right_max:
                right_max = height[r]
            else:
                total += right_max, height[r]
            r -= 1
    return total
```

**Complexity**
- **Time:** O(n). Each index visited once.
- **Space:** O(1).

### Monotonic-stack alternative (also O(n), O(n) space)
A monotonic decreasing stack of indices computes the trapped water by popping whenever a larger bar is encountered, the popped bar forms the bottom of a basin bounded by the new bar and the next bar on the stack. Same Big-O as the two-pointer version; different pattern.

```python
def trap_stack(height: list[int]) -> int:
    stack = []
    total = 0
    for i, h in enumerate(height):
        while stack and height[stack[-1]] < h:
            bottom = stack.pop()
            if not stack:
                break
            left = stack[-1]
            width = i, left, 1
            bounded = min(height[left], h), height[bottom]
            total += width * bounded
        stack.append(i)
    return total
```

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Nested max scans | O(n²) | O(1) |
| Precomputed max arrays | O(n) | O(n) |
| **Two pointers** | **O(n)** | **O(1)** |
| Monotonic stack | O(n) | O(n) |

Two pointers is the optimal standard answer. The monotonic-stack variant is worth knowing because the technique solves adjacent problems (Largest Rectangle in Histogram, Sum of Subarray Minimums).

## Related data structures

- [Arrays](../../../data-structures/arrays/), input and two-pointer sweep
- [Stacks](../../../data-structures/stacks/), monotonic-stack alternative; same O(n) with different mechanics
