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

## Approach 1: Brute force — generate all permutations of s1

Generate every permutation of `s1` and check whether any is a substring of `s2`.

```python
from itertools import permutations

def check_inclusion(s1: str, s2: str) -> bool:
    for p in permutations(s1):
        if "".join(p) in s2:
            return True
    return False
```

**Complexity**
- **Time:** O(n! · m) where n = `len(s1)`, m = `len(s2)`. Effectively unusable for n > 10.
- **Space:** O(n) per permutation.

Included to emphasize "permutation substring = anagram substring" — don't actually enumerate permutations.

## Approach 2: Check each window of length n for anagram

Slide a window of size `len(s1)` across `s2`; for each position, check whether the window is an anagram of `s1` using a `Counter` comparison.

```python
from collections import Counter

def check_inclusion(s1: str, s2: str) -> bool:
    n, m = len(s1), len(s2)
    if n > m:
        return False
    target = Counter(s1)
    for i in range(m - n + 1):
        if Counter(s2[i:i + n]) == target:
            return True
    return False
```

**Complexity**
- **Time:** O(m · n). O(m) windows × O(n) counter build & compare.
- **Space:** O(n).

## Approach 3: Fixed-size sliding window with running frequency (optimal)

Maintain a single running `Counter` over the current window. On each slide, increment the new character and decrement the old one. Compare counters in O(26) each step.

```python
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
```

**Complexity**
- **Time:** O(m). The Counter equality check is O(k) where k ≤ 26; linear overall.
- **Space:** O(k).

### Even tighter: matching counter with "matches" counter
Instead of comparing full counters every step, maintain a `matches` integer that counts how many characters in the alphabet have the correct count. Increment/decrement `matches` when a character's running count crosses its target. Check `matches == 26` each step. Same O(m), smaller constant factor.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate permutations | O(n! · m) | O(n) |
| Per-window Counter | O(m · n) | O(n) |
| **Running counter window** | **O(m)** | **O(k)** |

The key realization is "permutation substring ⇔ anagram substring" — once you see it, the fixed-size sliding window falls out.

## Related data structures

- [Strings](../../../data-structures/strings/) — input; substring == character sequence
- [Hash Tables](../../../data-structures/hash-tables/) — frequency counters over s1 and the running window
