---
title: "45. Jump Game II"
description: Minimum jumps to reach the last index.
parent: greedy
tags: [leetcode, neetcode-150, greedy, bfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums` where each `nums[i]` gives the max jump length from index `i`, return the minimum number of jumps to reach the last index. You can assume the last index is always reachable.

**Example**
- `nums = [2, 3, 1, 1, 4]` → `2`
- `nums = [2, 3, 0, 1, 4]` → `2`

LeetCode 45 · [Link](https://leetcode.com/problems/jump-game-ii/) · *Medium*

## Approach 1: DP — min jumps to reach each index

`dp[i]` = min jumps to reach `i`. `dp[i] = min(dp[j] + 1)` over `j` from which `i` is reachable.

```python
def jump(nums):
    n = len(nums)
    INF = float('inf')
    dp = [INF] * n
    dp[0] = 0
    for i in range(n):
        if dp[i] == INF:
            continue
        furthest = min(i + nums[i], n - 1)
        for j in range(i + 1, furthest + 1):
            dp[j] = min(dp[j], dp[i] + 1)
    return dp[n - 1]
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(n).

## Approach 2: BFS on jump levels

Treat each jump as a BFS level. All positions reachable in `k` jumps form level `k`. Return the level that contains the last index.

```python
def jump(nums):
    n = len(nums)
    if n <= 1:
        return 0
    visited = [False] * n
    visited[0] = True
    level = 0
    frontier = [0]
    while frontier:
        level += 1
        next_frontier = []
        for i in frontier:
            for k in range(1, nums[i] + 1):
                j = i + k
                if j >= n - 1:
                    return level
                if not visited[j]:
                    visited[j] = True
                    next_frontier.append(j)
        frontier = next_frontier
    return -1
```

**Complexity**
- **Time:** O(n²) worst case.
- **Space:** O(n).

## Approach 3: Greedy with current-end + farthest (optimal)

Track the rightmost index reachable within the current jump (`current_end`) and the global farthest reachable (`farthest`). When you cross `current_end`, you must have jumped once more, so set `current_end = farthest`.

```python
def jump(nums):
    jumps = 0
    current_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
    return jumps
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

### Intuition
This is BFS collapsed into a linear scan: the "frontier" of a BFS level is implicit in the window `[prev_end, current_end]`. Each time the walking index reaches `current_end`, we "commit" to another jump and extend to `farthest`.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DP | O(n²) | O(n) |
| BFS levels | O(n²) worst | O(n) |
| **Greedy with farthest** | **O(n)** | **O(1)** |

One of the cleanest greedy collapses of a BFS structure.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — scalar running bounds
