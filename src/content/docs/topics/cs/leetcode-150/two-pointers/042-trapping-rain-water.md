---
title: "42. Trapping Rain Water (Hard)"
description: Compute how much water is trapped between bars of varying heights after it rains.
parent: two-pointers
tags: [leetcode, neetcode-150, arrays, two-pointers, stacks, dp, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Water at position `i` = `max(0, min(leftMax[i], rightMax[i]) - height[i])`.

**Example**
- `height = [0,1,0,2,1,0,1,3,2,1,2,1]` → `6`
- `height = [4,2,0,3,2,5]` → `9`

LeetCode 42 · [Link](https://leetcode.com/problems/trapping-rain-water/) · *Hard*

## Approach 1: Brute force, for each position, scan for left/right max

For each index, find the max to its left and right, then compute the contribution.

```python
def trap(height: list[int]) -> int:
    n = len(height)                                    # L1: O(1)
    total = 0                                          # L2: O(1)
    for i in range(n):                                 # L3: outer loop, n iterations
        left_max = max(height[:i + 1])                 # L4: O(i) slice + max
        right_max = max(height[i:])                    # L5: O(n-i) slice + max
        total += min(left_max, right_max) - height[i]  # L6: O(1) contribution
    return total
```

**Where the time goes, line by line**

*Variables: n = len(height).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3 (outer loop) | O(1) | n | O(n) |
| **L4 (left max scan)** | **O(i)** | **n** | **O(n²) total** ← dominates |
| **L5 (right max scan)** | **O(n-i)** | **n** | **O(n²) total** ← dominates |
| L6 (contribution) | O(1) | n | O(n) |

Each max call scans a prefix/suffix of the array: O(i) and O(n-i) per iteration.

**Complexity**
- **Time:** O(n²), driven by L4/L5 (two max scans per index).
- **Space:** O(1) extra (Python slicing creates copies but the dominant cost is time).

## Approach 2: Precomputed left/right max arrays

Compute prefix max (from left) and suffix max (from right) once; sum contributions in a single pass.

```python
def trap(height: list[int]) -> int:
    n = len(height)                                    # L1: O(1)
    if n == 0:                                         # L2: O(1) guard
        return 0
    left_max = [0] * n                                 # L3: O(n)
    right_max = [0] * n                                # L4: O(n)

    left_max[0] = height[0]                            # L5: O(1)
    for i in range(1, n):                              # L6: forward pass
        left_max[i] = max(left_max[i - 1], height[i]) # L7: O(1)

    right_max[n - 1] = height[n - 1]                  # L8: O(1)
    for i in range(n - 2, -1, -1):                    # L9: backward pass
        right_max[i] = max(right_max[i + 1], height[i])  # L10: O(1)

    return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))  # L11: O(n)
```

**Where the time goes, line by line**

*Variables: n = len(height).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3, L4 (init arrays) | O(n) | 1 each | O(n) |
| **L6, L7 (left-max pass)** | **O(1)** | **n-1** | **O(n)** |
| **L9, L10 (right-max pass)** | **O(1)** | **n-1** | **O(n)** |
| **L11 (sum pass)** | **O(1) per element** | **n** | **O(n)** |

Three linear passes, each O(n). No pass dominates; all contribute equally.

**Complexity**
- **Time:** O(n), driven by L6/L7, L9/L10, and L11 (three linear passes).
- **Space:** O(n). Two auxiliary arrays.

Clean, easy to reason about, the right answer when memory isn't constrained.

## Approach 3: Two pointers with running max (optimal)

Keep two pointers `l` and `r` and two scalars `left_max` and `right_max`. At each step, operate on the side whose current height is smaller, we know the water level there is bounded by the smaller of the two running maxes. No auxiliary arrays needed.

```python
def trap(height: list[int]) -> int:
    l, r = 0, len(height) - 1       # L1: O(1) init pointers
    left_max = right_max = 0        # L2: O(1) running maxes
    total = 0                       # L3: O(1)
    while l < r:                    # L4: loop, n iterations total
        if height[l] < height[r]:   # L5: O(1) compare sides
            if height[l] >= left_max:   # L6: O(1)
                left_max = height[l]    # L7: O(1) update max
            else:
                total += left_max - height[l]  # L8: O(1) collect water
            l += 1                  # L9: O(1) advance left
        else:
            if height[r] >= right_max:  # L10: O(1)
                right_max = height[r]   # L11: O(1) update max
            else:
                total += right_max - height[r]  # L12: O(1) collect water
            r -= 1                  # L13: O(1) advance right
    return total
```

**Where the time goes, line by line**

*Variables: n = len(height).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (init) | O(1) | 1 | O(1) |
| L4 (loop condition) | O(1) | n | O(n) |
| **L5-L13 (per-step work)** | **O(1)** | **n** | **O(n)** ← dominates |

Each iteration advances either `l` or `r`; the two pointers start n-1 apart and converge, so exactly n-1 iterations.

**Complexity**
- **Time:** O(n), driven by L5-L13 (one O(1) step per pointer advance). Each index visited once.
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
            width = i - left - 1
            bounded = min(height[left], h) - height[bottom]
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

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_trapping_rain_water.py and run.
# Uses the canonical implementation (Approach 3: two pointers).

def trap(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    left_max = right_max = 0
    total = 0
    while l < r:
        if height[l] < height[r]:
            if height[l] >= left_max:
                left_max = height[l]
            else:
                total += left_max - height[l]
            l += 1
        else:
            if height[r] >= right_max:
                right_max = height[r]
            else:
                total += right_max - height[r]
            r -= 1
    return total

def _run_tests():
    assert trap([0,1,0,2,1,0,1,3,2,1,2,1]) == 6
    assert trap([4,2,0,3,2,5]) == 9
    assert trap([]) == 0
    assert trap([3]) == 0
    assert trap([3, 0, 3]) == 3
    assert trap([1, 0, 1]) == 1
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), input and two-pointer sweep
- [Stacks](../../../data-structures/stacks/), monotonic-stack alternative; same O(n) with different mechanics
