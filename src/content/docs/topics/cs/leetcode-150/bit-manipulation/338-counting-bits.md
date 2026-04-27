---
title: "338. Counting Bits (Easy)"
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
        while x:                        # L1: loop popcount(x) times
            x &= x - 1                  # L2: O(1), clear lowest set bit
            count += 1
        return count
    return [popcount(i) for i in range(n + 1)]  # L3: n+1 calls
```

**Where the time goes, line by line**

*Variables: n = the input integer (output array has n+1 entries).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L3 (list comp)** | **O(log i) per i** | **n+1** | **O(n log n)** ← dominates |
| L1-L2 (Kernighan per i) | O(popcount(i)) | n+1 | O(n log n) worst |

Each popcount(i) call costs O(number of set bits in i), which is at most O(log i); summed over 0..n this is O(n log n) worst case.

**Complexity**
- **Time:** O(n · log n) worst case.
- **Space:** O(n) output.

## Approach 2: DP via `i >> 1` (canonical)

`popcount(i) = popcount(i >> 1) + (i & 1)`. The value of `i >> 1` is already computed (it's less than `i`).

```python
def count_bits(n):
    dp = [0] * (n + 1)                  # L1: O(n)
    for i in range(1, n + 1):           # L2: single pass, n iterations
        dp[i] = dp[i >> 1] + (i & 1)   # L3: O(1) per i
    return dp
```

**Where the time goes, line by line**

*Variables: n = the input integer (output array has n+1 entries).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init dp) | O(1) | n+1 | O(n) |
| **L2, L3 (DP loop)** | **O(1)** | **n** | **O(n)** ← dominates |

Each entry is computed in O(1) from a previously computed entry; total work is O(n).

**Complexity**
- **Time:** O(n), driven by L2/L3 (single pass, O(1) per entry).
- **Space:** O(n) output.

### Why it works
`i >> 1` is `i` with its lowest bit dropped. Its popcount is therefore `popcount(i)` minus the lowest bit, so `popcount(i) = popcount(i >> 1) + (i & 1)`.

## Approach 3: DP via `i & (i - 1)`

Alternative recurrence: `popcount(i) = popcount(i & (i - 1)) + 1`, the right side clears one bit.

```python
def count_bits_v3(n):
    dp = [0] * (n + 1)                      # L1: O(n)
    for i in range(1, n + 1):               # L2: single pass, n iterations
        dp[i] = dp[i & (i - 1)] + 1         # L3: O(1) per i
    return dp
```

**Where the time goes, line by line**

*Variables: n = the input integer (output array has n+1 entries).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init dp) | O(1) | n+1 | O(n) |
| **L2, L3 (DP loop)** | **O(1)** | **n** | **O(n)** ← dominates |

Same complexity as Approach 2; `i & (i - 1)` clears the lowest set bit, giving a value already in `dp`.

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

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_338.py and run.
# Uses the canonical implementation (Approach 2: DP via i >> 1).

def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp

def _run_tests():
    assert count_bits(2) == [0, 1, 1]
    assert count_bits(5) == [0, 1, 1, 2, 1, 2]
    assert count_bits(0) == [0]           # edge: n=0, only entry is 0
    assert count_bits(1) == [0, 1]
    assert count_bits(8) == [0,1,1,2,1,2,2,3,1]  # power of 2 boundary
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), DP indexed by number
