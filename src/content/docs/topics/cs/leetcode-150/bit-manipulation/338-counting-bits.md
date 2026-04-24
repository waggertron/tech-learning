---
title: "338. Counting Bits"
description: Return an array where the i-th element is the number of 1-bits in i, for all i from 0 to n.
parent: bit-manipulation
tags: [leetcode, neetcode-150, bit-manipulation, dp, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a non-negative integer `n`, return an array `ans` of length `n + 1` where `ans[i]` is the number of `1` bits in `i`.

**Example**
- `n = 2` → `[0, 1, 1]`
- `n = 5` → `[0, 1, 1, 2, 1, 2]`

Follow-up: O(n) time and O(1) extra space (not counting the output).

LeetCode 338 · [Link](https://leetcode.com/problems/counting-bits/) · *Easy*

## Approach 1: Per-number popcount (Kernighan's)

Apply Approach 2 from problem 191 for each `i`.

```python
def count_bits(n):
    def popcount(x):
        count = 0
        while x:
            x &= x - 1
            count += 1
        return count
    return [popcount(i) for i in range(n + 1)]
```

**Complexity**
- **Time:** O(n · log n) worst case.
- **Space:** O(n) output.

## Approach 2: DP via `i >> 1` (canonical)

`popcount(i) = popcount(i >> 1) + (i & 1)`. The value of `i >> 1` is already computed (it's less than `i`).

```python
def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) output.

### Why it works
`i >> 1` is `i` with its lowest bit dropped. Its popcount is therefore `popcount(i)` minus the lowest bit, so `popcount(i) = popcount(i >> 1) + (i & 1)`.

## Approach 3: DP via `i & (i - 1)`

Alternative recurrence: `popcount(i) = popcount(i & (i - 1)) + 1` — the right side clears one bit.

```python
def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i & (i - 1)] + 1
    return dp
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Per-number Kernighan | O(n · log n) | O(n) |
| **DP via `i >> 1`** | **O(n)** | **O(n)** |
| DP via `i & (i - 1)` | O(n) | O(n) |

Both DP approaches are the right answer. The recurrence is a common interview favorite.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — DP indexed by number
