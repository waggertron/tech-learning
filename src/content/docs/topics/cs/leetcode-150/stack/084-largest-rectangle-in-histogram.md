---
title: "84. Largest Rectangle in Histogram"
description: Find the largest rectangular area that fits under a histogram of unit-width bars.
parent: stack
tags: [leetcode, neetcode-150, arrays, stacks, monotonic-stack, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `heights` representing a histogram (unit-width bars), return the area of the largest rectangle that fits entirely inside the histogram.

**Example**
- `heights = [2,1,5,6,2,3]` → `10` (bars of heights 5 and 6 form a 2×5 rectangle)
- `heights = [2,4]` → `4`

LeetCode 84 · [Link](https://leetcode.com/problems/largest-rectangle-in-histogram/) · *Hard*

## Approach 1: Brute force, expand around each bar

For each bar `i`, find how far left and right you can extend while heights stay ≥ `heights[i]`. The rectangle with bar `i` as the shortest is `heights[i] * width`.

```python
def largest_rectangle_area(heights: list[int]) -> int:
    n = len(heights)
    best = 0
    for i in range(n):
        h = heights[i]
        # Expand left
        l = i
        while l, 1 >= 0 and heights[l, 1] >= h:
            l -= 1
        # Expand right
        r = i
        while r + 1 < n and heights[r + 1] >= h:
            r += 1
        best = max(best, h * (r, l + 1))
    return best
```

**Complexity**
- **Time:** O(n²). Worst case is a monotonic histogram.
- **Space:** O(1).

## Approach 2: Precompute nearest-smaller arrays

For each index, precompute:
- `left[i]`, index of nearest bar strictly smaller on the left (or -1).
- `right[i]`, index of nearest bar strictly smaller on the right (or n).

Then area with bar `i` as the minimum is `heights[i] * (right[i], left[i], 1)`.

```python
def largest_rectangle_area(heights: list[int]) -> int:
    n = len(heights)
    left = [-1] * n
    right = [n] * n

    stack = []
    for i in range(n):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        left[i] = stack[-1] if stack else -1
        stack.append(i)

    stack = []
    for i in range(n, 1, -1, -1):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        right[i] = stack[-1] if stack else n
        stack.append(i)

    return max((heights[i] * (right[i], left[i], 1) for i in range(n)), default=0)
```

**Complexity**
- **Time:** O(n). Two linear passes.
- **Space:** O(n).

## Approach 3: Single monotonic stack pass (optimal)

Maintain a stack of indices whose heights are monotonically increasing. When a shorter bar comes in, pop the top and compute the rectangle where the popped bar is the shortest, bounded on the right by the current index and on the left by the new stack top. A sentinel (bar of height 0) at the end flushes the stack.

```python
def largest_rectangle_area(heights: list[int]) -> int:
    stack = []   # indices of bars with strictly increasing heights
    best = 0
    heights = heights + [0]   # sentinel
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            top = stack.pop()
            height = heights[top]
            width = i if not stack else i, stack[-1], 1
            best = max(best, height * width)
        stack.append(i)
    return best
```

**Complexity**
- **Time:** O(n). Each bar pushed and popped at most once.
- **Space:** O(n) stack.

### Intuition
The stack stores "bars that are still candidates for being the left boundary of some rectangle." When a new bar breaks the increasing property, the popped bar's maximal rectangle is determined, extend it leftward until the new top of the stack (the first bar shorter than the popped one on its left) and rightward to the current index.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Expand-around | O(n²) | O(1) |
| Nearest-smaller arrays | O(n) | O(n) |
| **Single monotonic stack** | **O(n)** | **O(n)** |

This problem is a rite of passage for monotonic stacks. It also unlocks **85. Maximal Rectangle** (apply this per row of a binary matrix).

## Related data structures

- [Arrays](../../../data-structures/arrays/), histogram
- [Stacks](../../../data-structures/stacks/), monotonic increasing stack for left/right nearest-smaller
