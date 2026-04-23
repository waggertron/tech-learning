---
title: "239. Sliding Window Maximum"
description: Return the maximum of every contiguous window of size k across an array.
parent: sliding-window
tags: [leetcode, neetcode-150, arrays, sliding-window, deque, heap, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums` and an integer `k`, return an array of the maximum value in every sliding window of size `k`.

**Example**
- `nums = [1,3,-1,-3,5,3,6,7]`, `k = 3` → `[3,3,5,5,6,7]`
- `nums = [1]`, `k = 1` → `[1]`

LeetCode 239 · [Link](https://leetcode.com/problems/sliding-window-maximum/) · *Hard*

## Approach 1: Brute force — compute max per window

For each of the `n - k + 1` windows, compute `max(...)` directly.

```python
def max_sliding_window(nums: list[int], k: int) -> list[int]:
    n = len(nums)
    return [max(nums[i:i + k]) for i in range(n - k + 1)]
```

**Complexity**
- **Time:** O(n · k). Each `max(...)` is O(k).
- **Space:** O(1) extra (output not counted).

## Approach 2: Max-heap with lazy deletion

Push `(-value, index)` onto a max-heap. For each new window position, pop entries whose index fell outside the window before reading the top.

```python
import heapq

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    heap = []
    result = []
    for i, x in enumerate(nums):
        heapq.heappush(heap, (-x, i))
        if i >= k - 1:
            # Evict out-of-window tops
            while heap[0][1] <= i - k:
                heapq.heappop(heap)
            result.append(-heap[0][0])
    return result
```

**Complexity**
- **Time:** O(n log n). Up to n pushes and pops over a heap of size up to n.
- **Space:** O(n). Heap grows until elements are evicted.

Good enough to pass but noticeably slower than the optimal.

## Approach 3: Monotonic deque (optimal)

Maintain a deque of **indices** whose corresponding values are strictly decreasing. The front of the deque is always the index of the current window's maximum.

On each new index `i`:
1. Pop from the back while the new value beats the back value (those indices can never be the max again).
2. Push `i`.
3. Pop from the front if it's outside the window (`i - k`).
4. Once `i >= k - 1`, record `nums[deque[0]]`.

```python
from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque()
    result = []
    for i, x in enumerate(nums):
        # Drop out-of-window index at the front
        while dq and dq[0] <= i - k:
            dq.popleft()
        # Maintain decreasing order at the back
        while dq and nums[dq[-1]] < x:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result
```

**Complexity**
- **Time:** O(n). Each index is pushed and popped at most once from the deque.
- **Space:** O(k). The deque holds at most `k` indices.

### Why it's correct
If `nums[j] < nums[i]` for some `j < i`, then `j` can never be the window max once `i` is in the window — so we can safely drop it. The deque therefore always holds the "still possibly useful" indices in decreasing value order.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Per-window max | O(n · k) | O(1) |
| Max-heap (lazy delete) | O(n log n) | O(n) |
| **Monotonic deque** | **O(n)** | **O(k)** |

The monotonic deque is the canonical answer. The same pattern solves sliding-window minimum and shows up in dynamic programming optimizations (convex-hull trick, monotonic queue DP).

## Related data structures

- [Arrays](../../../data-structures/arrays/) — input
- [Queues](../../../data-structures/queues/) — deque / monotonic deque is the optimal pattern
- [Heaps / Priority Queues](../../../data-structures/heaps/) — lazy-deletion max-heap alternative
