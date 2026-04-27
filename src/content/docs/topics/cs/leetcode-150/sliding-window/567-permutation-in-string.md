---
title: "567. Permutation in String"
description: Return true if one string contains any permutation of another as a substring.
parent: sliding-window
tags: [leetcode, neetcode-150, strings, sliding-window, hash-tables, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two strings `s1` and `s2`, return `true` if `s2` contains any permutation of `s1` as a substring.

**Example**
- `s1 = "ab"`, `s2 = "eidbaooo"` → `true` (`"ba"`)
- `s1 = "ab"`, `s2 = "eidboaoo"` → `false`

LeetCode 567 · [Link](https://leetcode.com/problems/permutation-in-string/) · *Medium*

## Approach 1: Brute force, generate all permutations of s1

Generate every permutation of `s1` and check whether any is a substring of `s2`.

```python
from itertools import permutations

def check_inclusion(s1: str, s2: str) -> bool:
    for p in permutations(s1):           # L1: n! permutations generated
        if "".join(p) in s2:            # L2: O(n) join + O(m) substring search
            return True
    return False
```

**Where the time goes, line by line**

*Variables: n = len(s1), m = len(s2).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (permutations)** | **O(n)** | **n!** | **O(n! · n)** ← dominates |
| L2 (join + in) | O(n + m) | up to n! | O(n! · (n + m)) |

`n!` grows faster than any polynomial. For n = 10 (len(s1) = 10), that's 3.6 million permutations; for n = 12, over 479 million.

**Complexity**
- **Time:** O(n! · m) where n = `len(s1)`, m = `len(s2)`. Effectively unusable for n > 10.
- **Space:** O(n) per permutation.

Included to emphasize "permutation substring = anagram substring", don't actually enumerate permutations.

## Approach 2: Check each window of length n for anagram

Slide a window of size `len(s1)` across `s2`; for each position, check whether the window is an anagram of `s1` using a `Counter` comparison.

```python
from collections import Counter

def check_inclusion(s1: str, s2: str) -> bool:
    n, m = len(s1), len(s2)
    if n > m:
        return False
    target = Counter(s1)                          # L1: O(n)
    for i in range(n, m + 1):                     # L2: m - n + 1 windows
        if Counter(s2[i - n:i]) == target:        # L3: O(n) slice + Counter; O(k) compare
            return True
    return False
```

**Where the time goes, line by line**

*Variables: n = len(s1), m = len(s2).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (Counter s1) | O(n) | 1 | O(n) |
| L2 (loop) | O(1) | m - n + 1 | O(m) |
| **L3 (Counter + compare)** | **O(n)** | **m - n + 1** | **O(m · n)** ← dominates |

For every window position we build a brand-new Counter from a slice, which scans n characters. No sharing across adjacent windows.

**Complexity**
- **Time:** O(m · n), driven by L3 (Counter build on every window).
- **Space:** O(n).

## Approach 3: Fixed-size sliding window with running frequency (optimal)

Maintain a single running `Counter` over the current window. On each slide, increment the new character and decrement the old one. Compare counters in O(26) each step.

```python
from collections import Counter

def check_inclusion(s1: str, s2: str) -> bool:
    n, m = len(s1), len(s2)
    if n > m:
        return False
    target = Counter(s1)                    # L1: O(n)
    window = Counter(s2[:n])               # L2: O(n) initial window
    if window == target:                   # L3: O(k) compare
        return True
    for i in range(n, m):                  # L4: slide m - n steps
        window[s2[i]] += 1                 # L5: O(1) add new char
        window[s2[i - n]] -= 1            # L6: O(1) remove old char
        if window[s2[i - n]] == 0:
            del window[s2[i - n]]          # L7: O(1) cleanup
        if window == target:               # L8: O(k) compare
            return True
    return False
```

**Where the time goes, line by line**

*Variables: n = len(s1), m = len(s2), k = number of distinct characters in s1 (≤ 26).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1/L2 (init) | O(n) | 1 | O(n) |
| L3 (initial check) | O(k) | 1 | O(k) |
| **L4 (slide loop)** | **O(1) body** | **m - n** | **O(m)** ← dominates |
| L5/L6/L7 (update window) | O(1) | m - n | O(m) |
| L8 (compare) | O(k) | m - n | O(m · k) = O(m) since k ≤ 26 |

Instead of rebuilding the Counter each step, we do two O(1) updates (L5/L6) and one O(k) comparison (L8). Since k ≤ 26, L8 is effectively O(1), making the total O(m).

**Complexity**
- **Time:** O(m), driven by L4/L8 (single pass with O(1) window updates and O(26) comparison).
- **Space:** O(k).

### Even tighter: matching counter with "matches" counter
Instead of comparing full counters every step, maintain a `matches` integer that counts how many characters in the alphabet have the correct count. Increment/decrement `matches` when a character's running count crosses its target. Check `matches == 26` each step. Same O(m), smaller constant factor.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate permutations | O(n! · m) | O(n) |
| Per-window Counter | O(m · n) | O(n) |
| **Running counter window** | **O(m)** | **O(k)** |

The key realization is "permutation substring ⇔ anagram substring", once you see it, the fixed-size sliding window falls out.

## Test cases

```python
# Quick smoke tests - paste into a REPL or save as test_567.py and run.
# Uses the optimal Approach 3 implementation.

from collections import Counter

def check_inclusion(s1: str, s2: str) -> bool:
    n, m = len(s1), len(s2)
    if n > m:
        return False
    target = Counter(s1)
    window = Counter(s2[:n])
    if window == target:
        return True
    for i in range(n, m):
        window[s2[i]] += 1
        window[s2[i - n]] -= 1
        if window[s2[i - n]] == 0:
            del window[s2[i - n]]
        if window == target:
            return True
    return False

def _run_tests():
    assert check_inclusion("ab", "eidbaooo") == True    # "ba" at index 3
    assert check_inclusion("ab", "eidboaoo") == False
    assert check_inclusion("a", "a") == True            # single char match
    assert check_inclusion("a", "b") == False           # single char no match
    assert check_inclusion("abc", "ab") == False        # s1 longer than s2
    assert check_inclusion("aab", "aabc") == True       # "aab" is a permutation match
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Strings](../../../data-structures/strings/), input; substring == character sequence
- [Hash Tables](../../../data-structures/hash-tables/), frequency counters over s1 and the running window
