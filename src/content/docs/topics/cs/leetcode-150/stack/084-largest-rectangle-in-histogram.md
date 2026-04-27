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
    n = len(heights)                               # L1: O(1)
    best = 0                                       # L2: O(1)
    for i in range(n):                             # L3: outer loop, n iterations
        h = heights[i]                             # L4: O(1)
        # Expand left
        l = i
        while l - 1 >= 0 and heights[l - 1] >= h: # L5: expand left, up to i steps
            l -= 1                                 # L6: O(1)
        # Expand right
        r = i
        while r + 1 < n and heights[r + 1] >= h:  # L7: expand right, up to n-i steps
            r += 1                                 # L8: O(1)
        best = max(best, h * (r - l + 1))          # L9: O(1) area
    return best
```

**Where the time goes, line by line**

*Variables: n = len(heights).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3 (outer loop) | O(1) | n | O(n) |
| **L5-L8 (expand left + right)** | **O(1) per step** | **up to n per outer** | **O(n²)** ← dominates |
| L9 (area) | O(1) | n | O(n) |

In the worst case (a monotonic histogram), each bar expands across the entire remaining array.

**Complexity**
- **Time:** O(n²), driven by L5-L8 (worst-case full expansion per bar).
- **Space:** O(1).

## Approach 2: Precompute nearest-smaller arrays

For each index, precompute:
- `left[i]`, index of nearest bar strictly smaller on the left (or -1).
- `right[i]`, index of nearest bar strictly smaller on the right (or n).

Then area with bar `i` as the minimum is `heights[i] * (right[i] - left[i] - 1)`.

```python
def largest_rectangle_area(heights: list[int]) -> int:
    n = len(heights)                               # L1: O(1)
    left = [-1] * n                                # L2: O(n)
    right = [n] * n                                # L3: O(n)

    stack = []
    for i in range(n):                             # L4: forward pass for left[]
        while stack and heights[stack[-1]] >= heights[i]:  # L5: pop larger
            stack.pop()                            # L6: O(1) amortized
        left[i] = stack[-1] if stack else -1       # L7: O(1)
        stack.append(i)                            # L8: O(1)

    stack = []
    for i in range(n - 1, -1, -1):                # L9: backward pass for right[]
        while stack and heights[stack[-1]] >= heights[i]:  # L10: pop larger
            stack.pop()                            # L11: O(1) amortized
        right[i] = stack[-1] if stack else n       # L12: O(1)
        stack.append(i)                            # L13: O(1)

    return max((heights[i] * (right[i] - left[i] - 1) for i in range(n)), default=0)  # L14: O(n)
```

**Where the time goes, line by line**

*Variables: n = len(heights).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2, L3 (init arrays) | O(n) | 1 each | O(n) |
| **L4-L8 (left pass, stack)** | **O(1) amortized** | **n** | **O(n)** |
| **L9-L13 (right pass, stack)** | **O(1) amortized** | **n** | **O(n)** |
| L14 (compute max) | O(1) per element | n | O(n) |

Each index is pushed and popped at most once per pass; the stack operations are O(n) total per pass.

**Complexity**
- **Time:** O(n), driven by L4-L8 and L9-L13 (two linear monotonic-stack passes).
- **Space:** O(n) for the left/right arrays and stack.

## Approach 3: Single monotonic stack pass (optimal)

Maintain a stack of indices whose heights are monotonically increasing. When a shorter bar comes in, pop the top and compute the rectangle where the popped bar is the shortest, bounded on the right by the current index and on the left by the new stack top. A sentinel (bar of height 0) at the end flushes the stack.

```python
def largest_rectangle_area(heights: list[int]) -> int:
    stack = []                             # L1: O(1), indices with increasing heights
    best = 0                               # L2: O(1)
    heights = heights + [0]                # L3: O(n) sentinel appended
    for i, h in enumerate(heights):        # L4: n+1 iterations
        while stack and heights[stack[-1]] > h:  # L5: pop taller bars
            top = stack.pop()              # L6: O(1) amortized pop
            height = heights[top]          # L7: O(1)
            width = i if not stack else i - stack[-1] - 1  # L8: O(1) width
            best = max(best, height * width)  # L9: O(1) update
        stack.append(i)                    # L10: O(1) push
    return best
```

**Where the time goes, line by line**

*Variables: n = len(heights) (before sentinel).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3 (sentinel) | O(n) | 1 | O(n) |
| L4 (outer loop) | O(1) | n+1 | O(n) |
| **L5-L10 (stack ops + area)** | **O(1) amortized** | **n total pushes/pops** | **O(n)** ← dominates |

Each bar is pushed exactly once and popped at most once; the total push+pop count is 2n, giving O(n) amortized.

**Complexity**
- **Time:** O(n), driven by L5-L10 (each bar pushed and popped at most once).
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

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_largest_rectangle.py and run.
# Uses the canonical implementation (Approach 3: single monotonic stack).

def largest_rectangle_area(heights: list[int]) -> int:
    stack = []
    best = 0
    heights = heights + [0]
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            top = stack.pop()
            height = heights[top]
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)
        stack.append(i)
    return best

def _run_tests():
    assert largest_rectangle_area([2, 1, 5, 6, 2, 3]) == 10
    assert largest_rectangle_area([2, 4]) == 4
    assert largest_rectangle_area([1]) == 1
    assert largest_rectangle_area([6, 5, 4, 3, 2, 1]) == 12
    assert largest_rectangle_area([1, 2, 3, 4, 5, 6]) == 12
    assert largest_rectangle_area([2, 0, 2]) == 2
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), histogram
- [Stacks](../../../data-structures/stacks/), monotonic increasing stack for left/right nearest-smaller
