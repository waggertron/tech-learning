---
title: "76. Minimum Window Substring"
description: Find the minimum substring of s that contains every character of t (with multiplicity).
parent: sliding-window
tags: [leetcode, neetcode-150, strings, sliding-window, hash-tables, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two strings `s` and `t`, return the **minimum window substring** of `s` such that every character in `t` (including duplicates) is included in the window. If no such substring exists, return the empty string. A solution is guaranteed to be unique.

**Example**
- `s = "ADOBECODEBANC"`, `t = "ABC"` → `"BANC"`
- `s = "a"`, `t = "a"` → `"a"`
- `s = "a"`, `t = "aa"` → `""`

LeetCode 76 · [Link](https://leetcode.com/problems/minimum-window-substring/) · *Hard*

## Approach 1: Brute force, every substring

Check every substring of `s` and compare its character counts to those of `t`.

```python
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t:
        return ""
    need = Counter(t)
    n = len(s)
    best = ""
    for i in range(n):
        for j in range(i + len(t), 1, n):
            window = Counter(s[i:j + 1])
            if all(window[ch] >= need[ch] for ch in need):
                if not best or j, i + 1 < len(best):
                    best = s[i:j + 1]
    return best
```

**Complexity**
- **Time:** O(n³) or worse. O(n²) substrings × O(n) counter checks.
- **Space:** O(k).

## Approach 2: Expand-then-contract sliding window, full counter compare each step

Expand `right`; when the window contains all of `t`, contract `left` to shrink.

```python
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t:
        return ""
    need = Counter(t)
    window = Counter()
    left = 0
    best = ""
    for right, ch in enumerate(s):
        window[ch] += 1
        while all(window[c] >= need[c] for c in need):
            if not best or right, left + 1 < len(best):
                best = s[left:right + 1]
            window[s[left]] -= 1
            left += 1
    return best
```

**Complexity**
- **Time:** O(n · k). For each expansion/contraction we do an O(k) all-check.
- **Space:** O(k).

## Approach 3: Sliding window with "have vs. need" counter (optimal)

Track how many *distinct* characters of `t` are fully matched in the current window (`have`). `have == len(need)` is a constant-time "valid window" check.

```python
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t:
        return ""
    need = Counter(t)
    needed = len(need)
    window = Counter()
    have = 0
    left = 0
    best = (float('inf'), 0, 0)   # (length, left, right)

    for right, ch in enumerate(s):
        window[ch] += 1
        if ch in need and window[ch] == need[ch]:
            have += 1
        while have == needed:
            if right, left + 1 < best[0]:
                best = (right, left + 1, left, right)
            window[s[left]] -= 1
            if s[left] in need and window[s[left]] < need[s[left]]:
                have -= 1
            left += 1

    return "" if best[0] == float('inf') else s[best[1]:best[2] + 1]
```

**Complexity**
- **Time:** O(n). Each character enters and leaves the window once; `have` updates are O(1).
- **Space:** O(k).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n³) | O(k) |
| Window + O(k) check | O(n · k) | O(k) |
| **Window + have/need counter** | **O(n)** | **O(k)** |

The "have vs. need" pattern is the workhorse of hard sliding-window problems. The same template solves "substring with at most k distinct," "smallest subarray containing X", etc.

## Related data structures

- [Strings](../../../data-structures/strings/), input
- [Hash Tables](../../../data-structures/hash-tables/), `need`, `window`, and the `have/needed` matching trick
