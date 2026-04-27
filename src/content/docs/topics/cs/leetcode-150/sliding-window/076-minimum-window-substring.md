---
title: "76. Minimum Window Substring (Hard)"
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
    need = Counter(t)                                         # L1: O(|t|)
    n = len(s)
    best = ""
    for i in range(n):                                        # L2: outer loop, n iterations
        for j in range(i + len(t), n + 1):                   # L3: inner loop, O(n) per outer
            window = Counter(s[i:j])                          # L4: slice + Counter, O(n) each
            if all(window[ch] >= need[ch] for ch in need):   # L5: O(k) check
                if not best or j - i < len(best):
                    best = s[i:j]                             # L6: O(n) slice
    return best
```

**Where the time goes, line by line**

*Variables: n = len(s), k = number of distinct characters in t.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (Counter(t)) | O(|t|) | 1 | O(|t|) |
| L2 (outer loop) | O(1) | n | O(n) |
| L3 (inner loop) | O(1) | O(n²) total | O(n²) |
| **L4 (Counter build)** | **O(n)** | **O(n²)** | **O(n³)** ← dominates |
| L5 (all check) | O(k) | O(n²) | O(n² · k) |

L4 is the killer: building a `Counter` from a slice requires scanning the slice, which is O(n) per call, and we call it O(n²) times.

**Complexity**
- **Time:** O(n³) or worse, driven by L4 (Counter on every substring pair).
- **Space:** O(k).

## Approach 2: Expand-then-contract sliding window, full counter compare each step

Expand `right`; when the window contains all of `t`, contract `left` to shrink.

```python
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t:
        return ""
    need = Counter(t)                                          # L1: O(|t|)
    window = Counter()                                         # L2: O(1)
    left = 0
    best = ""
    for right, ch in enumerate(s):                            # L3: outer loop, n iterations
        window[ch] += 1                                        # L4: O(1)
        while all(window[c] >= need[c] for c in need):        # L5: O(k) per check
            if not best or right - left + 1 < len(best):
                best = s[left:right + 1]                      # L6: O(n) slice
            window[s[left]] -= 1                              # L7: O(1)
            left += 1                                         # L8: O(1)
    return best
```

**Where the time goes, line by line**

*Variables: n = len(s), k = number of distinct characters in t.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L2 (init) | O(|t|) | 1 | O(|t|) |
| L3 (expand right) | O(1) | n | O(n) |
| L4 (increment) | O(1) | n | O(n) |
| **L5 (all-check)** | **O(k)** | **O(n) times** | **O(n · k)** ← dominates |
| L6 (best slice) | O(n) | at most n | O(n²) in theory but rarely |
| L7/L8 (shrink left) | O(1) | at most n total | O(n) |

The `all(...)` check iterates over all k distinct characters of t every time the window is valid. Since `left` moves at most n times and `right` moves n times, L5 fires O(n) times total, giving O(n · k).

**Complexity**
- **Time:** O(n · k), driven by L5 (the O(k) all-check inside the while loop).
- **Space:** O(k).

## Approach 3: Sliding window with "have vs. need" counter (optimal)

Track how many *distinct* characters of `t` are fully matched in the current window (`have`). `have == len(need)` is a constant-time "valid window" check.

```python
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t:
        return ""
    need = Counter(t)                                      # L1: O(|t|)
    needed = len(need)                                     # L2: O(1)
    window = Counter()                                     # L3: O(1)
    have = 0                                               # L4: O(1)
    left = 0
    best = (float('inf'), 0, 0)                            # L5: O(1)

    for right, ch in enumerate(s):                         # L6: outer loop, n iterations
        window[ch] += 1                                    # L7: O(1)
        if ch in need and window[ch] == need[ch]:          # L8: O(1) comparison
            have += 1                                      # L9: O(1)
        while have == needed:                              # L10: O(1) guard; shrink loop
            if right - left + 1 < best[0]:
                best = (right - left + 1, left, right)    # L11: O(1) tuple
            window[s[left]] -= 1                           # L12: O(1)
            if s[left] in need and window[s[left]] < need[s[left]]:
                have -= 1                                  # L13: O(1)
            left += 1                                      # L14: O(1)

    return "" if best[0] == float('inf') else s[best[1]:best[2] + 1]
```

**Where the time goes, line by line**

*Variables: n = len(s), k = number of distinct characters in t.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L5 (init) | O(|t|) | 1 | O(|t|) |
| **L6 (expand right)** | **O(1) body** | **n** | **O(n)** ← dominates |
| L7/L8/L9 (window update) | O(1) | n | O(n) |
| L10-L14 (shrink left) | O(1) per step | at most n total | O(n) |

The key upgrade over Approach 2: `have` is an integer that tracks how many distinct characters of `t` are fully satisfied. Checking `have == needed` is O(1) rather than O(k). Each character crosses the window boundary at most twice (once entering, once leaving), so the total work is O(n).

**Complexity**
- **Time:** O(n), driven by L6/L7/L8 (the single linear pass with O(1) window updates).
- **Space:** O(k).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n³) | O(k) |
| Window + O(k) check | O(n · k) | O(k) |
| **Window + have/need counter** | **O(n)** | **O(k)** |

The "have vs. need" pattern is the workhorse of hard sliding-window problems. The same template solves "substring with at most k distinct," "smallest subarray containing X", etc.

## Test cases

```python
# Quick smoke tests - paste into a REPL or save as test_076.py and run.
# Uses the optimal Approach 3 implementation.

from collections import Counter

def min_window(s: str, t: str) -> str:
    if not s or not t:
        return ""
    need = Counter(t)
    needed = len(need)
    window = Counter()
    have = 0
    left = 0
    best = (float('inf'), 0, 0)

    for right, ch in enumerate(s):
        window[ch] += 1
        if ch in need and window[ch] == need[ch]:
            have += 1
        while have == needed:
            if right - left + 1 < best[0]:
                best = (right - left + 1, left, right)
            window[s[left]] -= 1
            if s[left] in need and window[s[left]] < need[s[left]]:
                have -= 1
            left += 1

    return "" if best[0] == float('inf') else s[best[1]:best[2] + 1]

def _run_tests():
    assert min_window("ADOBECODEBANC", "ABC") == "BANC"
    assert min_window("a", "a") == "a"
    assert min_window("a", "aa") == ""           # t requires two a's, s has one
    assert min_window("", "a") == ""             # empty s
    assert min_window("abc", "") == ""           # empty t
    assert min_window("aa", "aa") == "aa"        # exact match with duplicates
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Strings](../../../data-structures/strings/), input
- [Hash Tables](../../../data-structures/hash-tables/), `need`, `window`, and the `have/needed` matching trick
