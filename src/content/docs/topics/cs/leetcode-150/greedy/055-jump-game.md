---
title: "55. Jump Game (Medium)"
description: Determine if you can reach the last index from the first, where each nums[i] gives the max jump length.
parent: greedy
tags: [leetcode, neetcode-150, greedy, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums`, you start at index 0 and can jump up to `nums[i]` steps from index `i`. Return `true` if you can reach the last index.

**Example**
- `nums = [2, 3, 1, 1, 4]` → `true`
- `nums = [3, 2, 1, 0, 4]` → `false`

LeetCode 55 · [Link](https://leetcode.com/problems/jump-game/) · *Medium*

## Approach 1: Recursive, try every jump

```python
def can_jump(nums):
    def f(i):                                   # L1: called exponential times naively
        if i >= len(nums) - 1:
            return True                         # L2: base case O(1)
        for step in range(1, nums[i] + 1):      # L3: try each step
            if f(i + step):                     # L4: recursive call
                return True
        return False
    return f(0)
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (base check) | O(1) | once per call | O(calls) |
| **L3, L4 (recursive fan-out)** | **O(calls)** | **exponential** | **O(n^n)** ← dominates |

Without memoization, the same subproblem `f(i)` is called many times; worst case is exponential.

**Complexity**
- **Time:** Exponential, driven by L3/L4 (unbounded recursive fan-out).
- **Space:** O(n) recursion depth.

## Approach 2: Top-down or bottom-up DP

`dp[i]` = reachable from `i`? `dp[n - 1] = True`; walk backward, `dp[i] = any(dp[i + k] for k in 1..nums[i])`.

```python
def can_jump(nums):
    n = len(nums)                               # L1: O(1)
    dp = [False] * n                            # L2: O(n)
    dp[n - 1] = True                            # L3: O(1)
    for i in range(n - 1, 0, -1):              # L4: outer loop, n-1 iterations
        furthest = min(i + nums[i], n - 1)
        for j in range(i + 1, furthest + 1):    # L5: inner loop, up to n per i
            if dp[j]:
                dp[i] = True
                break
    return dp[0]
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (init dp) | O(1) | n | O(n) |
| L4 (outer loop) | O(1) | n-1 | O(n) |
| **L5 (inner loop)** | **O(1)** | **up to n per i** | **O(n²)** ← dominates |

The inner scan at each `i` can range over the entire remaining array in the worst case.

**Complexity**
- **Time:** O(n²), driven by L5 (inner scan for reachable positions).
- **Space:** O(n) for the dp array.

## Approach 3: Greedy running max-reach (optimal)

Walk left to right; track the furthest index reachable. If the current index exceeds it, we're stuck.

```python
def can_jump(nums):
    max_reach = 0                               # L1: O(1)
    for i, x in enumerate(nums):               # L2: single pass, n iterations
        if i > max_reach:                       # L3: O(1)
            return False
        max_reach = max(max_reach, i + x)       # L4: O(1), update reach
        if max_reach >= len(nums) - 1:          # L5: O(1), early exit
            return True
    return True
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| **L2-L5 (loop)** | **O(1)** | **n** | **O(n)** ← dominates |
| L3 (stuck check) | O(1) | n | O(n) |
| L4 (update reach) | O(1) | n | O(n) |

A single linear scan; each element is visited once.

**Complexity**
- **Time:** O(n), driven by L2/L3/L4 (single linear scan).
- **Space:** O(1).

### Why greedy works
If the furthest reachable index is `R`, every position `i ≤ R` is reachable. So we only need to update `R = max(R, i + nums[i])` as we walk. No DP table needed.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | exponential | O(n) |
| DP | O(n²) | O(n) |
| **Greedy max-reach** | **O(n)** | **O(1)** |

Monotone-invariant greedy, `max_reach` is non-decreasing; the algorithm fails fast the moment it's exceeded.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_055.py and run.
# Uses the canonical implementation (Approach 3: greedy max-reach).

def can_jump(nums):
    max_reach = 0
    for i, x in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + x)
        if max_reach >= len(nums) - 1:
            return True
    return True

def _run_tests():
    assert can_jump([2, 3, 1, 1, 4]) == True
    assert can_jump([3, 2, 1, 0, 4]) == False
    assert can_jump([0]) == True           # single element, already at end
    assert can_jump([1, 0]) == True        # one jump gets to end
    assert can_jump([0, 1]) == False       # stuck at index 0 immediately
    assert can_jump([2, 0, 0]) == True     # jump over zeros
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), running max-reach
