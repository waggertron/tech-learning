---
title: "91. Decode Ways"
description: Count the number of ways a digit string can be decoded to letters A–Z under the mapping A=1, Z=26.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

A digit string can be decoded to letters using `A=1, B=2, ..., Z=26`. Given a digit string, return the number of ways to decode it. `0` cannot start a code (no letter maps to `0` or to `01`, `02`, …).

**Example**
- `s = "12"` → `2` (`"AB"`, `"L"`)
- `s = "226"` → `3` (`"BZ"`, `"VF"`, `"BBF"`)
- `s = "06"` → `0`

LeetCode 91 · [Link](https://leetcode.com/problems/decode-ways/) · *Medium*

## Approach 1: Recursive — try single and double digit

At position `i`, try decoding 1 digit (if ≠ '0') and/or 2 digits (if in `[10, 26]`).

```python
def num_decodings(s):
    def f(i):
        if i == len(s):
            return 1
        if s[i] == '0':
            return 0
        ways = f(i + 1)
        if i + 1 < len(s) and 10 <= int(s[i:i + 2]) <= 26:
            ways += f(i + 2)
        return ways
    return f(0)
```

**Complexity**
- **Time:** O(2ⁿ).
- **Space:** O(n).

## Approach 2: Top-down memoized

```python
from functools import lru_cache

def num_decodings(s):
    @lru_cache(maxsize=None)
    def f(i):
        if i == len(s):
            return 1
        if s[i] == '0':
            return 0
        ways = f(i + 1)
        if i + 1 < len(s) and 10 <= int(s[i:i + 2]) <= 26:
            ways += f(i + 2)
        return ways
    return f(0)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

## Approach 3: Bottom-up with two variables (optimal)

`dp[i]` = ways to decode prefix of length `i`. `dp[0] = 1`, `dp[i] = (one-digit ok ? dp[i-1] : 0) + (two-digit ok ? dp[i-2] : 0)`.

```python
def num_decodings(s):
    if not s or s[0] == '0':
        return 0
    prev2, prev1 = 1, 1
    for i in range(1, len(s)):
        cur = 0
        if s[i] != '0':
            cur += prev1
        two = int(s[i - 1:i + 1])
        if 10 <= two <= 26:
            cur += prev2
        prev2, prev1 = prev1, cur
    return prev1
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2ⁿ) | O(n) |
| Memoized | O(n) | O(n) |
| **Bottom-up, two vars** | **O(n)** | **O(1)** |

Index-DP on strings with local transition rules — template for Unique BSTs, Partition DP, and similar problems.

## Related data structures

- [Strings](../../../data-structures/strings/) — input; DP over index
