---
title: "647. Palindromic Substrings (Medium)"
description: Count the number of palindromic substrings in a string.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s`, return the number of palindromic substrings (counting duplicates).

**Example**
- `s = "abc"` → `3` (a, b, c)
- `s = "aaa"` → `6` (a, a, a, aa, aa, aaa)

LeetCode 647 · [Link](https://leetcode.com/problems/palindromic-substrings/) · *Medium*

## Approach 1: Brute force, check every substring

```python
def count_substrings(s):
    def is_pal(t):
        return t == t[::-1]          # L1: O(k) where k = len(t)
    count = 0
    for i in range(len(s)):          # L2: outer loop, n iterations
        for j in range(i, len(s)):   # L3: inner loop, up to n iterations
            if is_pal(s[i:j + 1]):   # L4: slice O(k) + reverse compare O(k)
                count += 1           # L5: O(1)
    return count
```

**Where the time goes, line by line**

*Variables: n = len(s).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2, L3 (nested loops) | O(1) | n² pairs | O(n²) |
| **L4 (slice + palindrome check)** | **O(k) per pair** | **n² pairs, avg k = n/2** | **O(n³)** ← dominates |
| L5 (increment) | O(1) | up to n² | O(n²) |

The slice `s[i:j+1]` allocates a new string of length k, and the reverse comparison scans it again. Over all O(n²) pairs the average substring length is O(n), giving O(n³) total.

**Complexity**
- **Time:** O(n³), driven by L4 (slice + reverse per pair).
- **Space:** O(n) per slice (the largest slice is the whole string).

## Approach 2: Expand around center (canonical)

For each of `2n - 1` centers, expand outward and count every step that forms a palindrome.

```python
def count_substrings(s):
    def expand(l, r):
        count = 0
        while l >= 0 and r < len(s) and s[l] == s[r]:  # L1: O(1) per iteration
            count += 1                                   # L2: O(1)
            l -= 1                                       # L3: O(1)
            r += 1                                       # L4: O(1)
        return count

    return sum(expand(i, i) + expand(i, i + 1) for i in range(len(s)))  # L5: 2n calls
```

**Where the time goes, line by line**

*Variables: n = len(s).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L5 (loop over centers) | O(1) | 2n - 1 centers | O(n) calls |
| L1 (expand while condition) | O(1) | up to n per center | varies |
| **L1-L4 (total expansion work)** | **O(1) per step** | **O(n) steps total** | **O(n²)** ← dominates |
| L2-L4 (count + advance) | O(1) | same as L1 | O(n²) |

Each character can be the turning point of at most O(n) expansion steps, but summed across all 2n-1 centers the total expansion steps are bounded by O(n²) in the worst case (e.g., "aaaa...").

**Complexity**
- **Time:** O(n²), driven by L1-L4 (expansion work summed across all centers).
- **Space:** O(1) (no auxiliary structure; just two integer pointers).

## Approach 3: DP table

`dp[i][j] = True` iff `s[i:j+1]` is a palindrome. Fill by length; count the `True` entries.

```python
def count_substrings(s):
    n = len(s)                                           # L1: O(1)
    dp = [[False] * n for _ in range(n)]                 # L2: O(n²)
    count = 0
    for i in range(n):                                   # L3: base case, length-1
        dp[i][i] = True                                  # L4: O(1)
        count += 1                                       # L5: O(1)
    for length in range(2, n + 1):                       # L6: outer loop over lengths
        for i in range(n - length + 1):                  # L7: valid start positions
            j = i + length - 1                           # L8: O(1)
            if s[i] == s[j] and (length == 2 or dp[i + 1][j - 1]):  # L9: O(1) lookup
                dp[i][j] = True                          # L10: O(1)
                count += 1                               # L11: O(1)
    return count
```

**Where the time goes, line by line**

*Variables: n = len(s).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (allocate dp) | O(n²) | 1 | O(n²) |
| L3-L5 (base cases) | O(1) | n | O(n) |
| L6, L7 (nested loops) | O(1) | n(n-1)/2 pairs | O(n²) |
| **L8-L11 (fill + count)** | **O(1)** | **O(n²) pairs** | **O(n²)** ← dominates |

Each cell is filled in O(1) using a previously-computed shorter-length result. The outer loop sweeps lengths 2..n; the inner loop covers all valid start positions for that length, giving exactly n(n-1)/2 iterations total.

**Complexity**
- **Time:** O(n²), driven by L6/L7/L8-L11 (the nested length-and-index loops).
- **Space:** O(n²) for the dp table.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| All substrings | O(n³) | O(n) |
| **Expand around center** | **O(n²)** | **O(1)** |
| DP table | O(n²) | O(n²) |

Same pattern as problem 5. Manacher's gives O(n) if you need it.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_647.py and run.
# Uses the canonical implementation (Approach 2: expand around center).

def count_substrings(s):
    def expand(l, r):
        count = 0
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1
            r += 1
        return count

    return sum(expand(i, i) + expand(i, i + 1) for i in range(len(s)))

def _run_tests():
    assert count_substrings("abc") == 3    # LeetCode example 1: a, b, c
    assert count_substrings("aaa") == 6    # LeetCode example 2: a,a,a,aa,aa,aaa
    assert count_substrings("a") == 1      # single character
    assert count_substrings("aa") == 3     # a, a, aa
    assert count_substrings("abba") == 6   # a,b,b,a,bb,abba
    assert count_substrings("racecar") == 10  # r,a,c,e,c,a,r,aceca,cec,racecar
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Strings](../../../data-structures/strings/), center-expansion
