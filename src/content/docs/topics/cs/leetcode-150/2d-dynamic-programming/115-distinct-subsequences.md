---
title: "115. Distinct Subsequences (Hard)"
description: Count the number of distinct subsequences of s that equal t.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two strings `s` and `t`, return the number of distinct subsequences of `s` that equal `t`. The answer fits in a 32-bit signed integer.

**Example**
- `s = "rabbbit"`, `t = "rabbit"` → `3`
- `s = "babgbag"`, `t = "bag"` → `5`

LeetCode 115 · [Link](https://leetcode.com/problems/distinct-subsequences/) · *Hard*

## Approach 1: Recursive

`f(i, j)` = number of ways `t[j:]` appears as a subsequence of `s[i:]`.

- If `j == len(t)`: matched everything → 1.
- If `i == len(s)`: out of characters → 0.
- If `s[i] == t[j]`: `f(i + 1, j + 1) + f(i + 1, j)` (use or skip).
- Else: `f(i + 1, j)` (must skip).

```python
def num_distinct(s, t):
    def f(i, j):
        if j == len(t):                             # L1: O(1) base: t fully matched
            return 1
        if i == len(s):                             # L2: O(1) base: s exhausted
            return 0
        if s[i] == t[j]:                            # L3: O(1) char match check
            return f(i + 1, j + 1) + f(i + 1, j)  # L4: two calls (use or skip)
        return f(i + 1, j)                          # L5: one call (must skip)
    return f(0, 0)
```

**Where the time goes, line by line**

*Variables: m = len(s), n = len(t).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (base + match check) | O(1) | per call | O(1) each |
| **L4 (two recursive calls on match)** | **O(1) work + 2 calls** | **worst case every call** | **O(2^m)** ← dominates |
| L5 (one recursive call on mismatch) | O(1) work + 1 call | per mismatch | O(2^m) same tree |

In the worst case (s and t all the same character), every position in `s` can match `t[j]`, spawning two branches each time. The call tree is exponential in `m`.

**Complexity**
- **Time:** O(2^n) in the worst case (here n = len(s)), driven by L4 double-branching.
- **Space:** O(n) recursion depth.

## Approach 2: Top-down memoized

```python
from functools import lru_cache

def num_distinct(s, t):
    @lru_cache(maxsize=None)                        # L1: cache decorator
    def f(i, j):
        if j == len(t):                             # L2: O(1) base case
            return 1
        if i == len(s):                             # L3: O(1) base case
            return 0
        if s[i] == t[j]:                            # L4: O(1) char match
            return f(i + 1, j + 1) + f(i + 1, j)  # L5: O(1) with cache
        return f(i + 1, j)                          # L6: O(1) with cache
    return f(0, 0)
```

**Where the time goes, line by line**

*Variables: m = len(s), n = len(t).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (lru_cache) | O(1) | 1 | O(1) |
| L2-L4 (checks) | O(1) | once per unique (i,j) | O(m · n) total |
| **L5, L6 (cached calls)** | **O(1) per call** | **at most (m+1)(n+1) states** | **O(m · n)** ← dominates |

Each `(i, j)` pair is computed exactly once. There are `(m+1) * (n+1)` such pairs, each doing O(1) work.

**Complexity**
- **Time:** O(m · n), driven by L5/L6 across all unique (i,j) states.
- **Space:** O(m · n) for the memo table.

## Approach 3: Bottom-up 2-D DP + rolling to 1-D (optimal space)

`dp[j]` = number of ways `t[:j]` appears as a subsequence of the current prefix of `s`. Iterate j from high to low to avoid reusing updates within a single row.

```python
def num_distinct(s, t):
    m, n = len(s), len(t)                  # L1: O(1)
    dp = [0] * (n + 1)                     # L2: O(n) 1-D table init
    dp[0] = 1                              # L3: O(1) base: empty t matched by any prefix
    for i in range(m):                     # L4: outer loop over s O(m)
        for j in range(n, 0, -1):         # L5: inner loop over t, right-to-left O(n)
            if s[i] == t[j - 1]:          # L6: O(1) char match check
                dp[j] += dp[j - 1]        # L7: O(1) accumulate ways
    return dp[n]                           # L8: O(1) answer
```

**Where the time goes, line by line**

*Variables: m = len(s), n = len(t).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (init) | O(n) | 1 | O(n) |
| **L4+L5 (double loop)** | **O(1) body** | **m · n** | **O(m · n)** ← dominates |
| L6-L7 (update) | O(1) | at most m · n | included above |

The right-to-left inner loop is critical: it prevents an `s[i]` character from being used to extend two different `t` prefixes in the same outer iteration (same reason 0/1 knapsack iterates right-to-left).

**Complexity**
- **Time:** O(m · n), driven by L4/L5 (the double loop).
- **Space:** O(n) for the rolling 1-D array.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2^n) | O(n) |
| Top-down memo | O(m · n) | O(m · n) |
| **1-D bottom-up DP** | **O(m · n)** | **O(n)** |

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_115.py and run.
# Uses the canonical implementation (Approach 3: 1-D bottom-up DP).

def num_distinct(s, t):
    m, n = len(s), len(t)
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(m):
        for j in range(n, 0, -1):
            if s[i] == t[j - 1]:
                dp[j] += dp[j - 1]
    return dp[n]

def _run_tests():
    # problem statement examples
    assert num_distinct("rabbbit", "rabbit") == 3
    assert num_distinct("babgbag", "bag") == 5
    # edge: t is empty (one way: pick nothing)
    assert num_distinct("abc", "") == 1
    # edge: s is empty, t is not
    assert num_distinct("", "a") == 0
    # edge: s == t (exactly one way)
    assert num_distinct("abc", "abc") == 1
    # no match at all
    assert num_distinct("aaa", "b") == 0
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Strings](../../../data-structures/strings/), subsequence counting DP
