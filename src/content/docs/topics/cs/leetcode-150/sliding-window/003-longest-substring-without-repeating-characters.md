---
title: "3. Longest Substring Without Repeating Characters"
description: Find the length of the longest substring without repeating characters.
parent: sliding-window
tags: [leetcode, neetcode-150, strings, sliding-window, hash-tables, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s`, find the length of the longest substring without repeating characters.

**Example**
- `s = "abcabcbb"` → `3` (`"abc"`)
- `s = "bbbbb"` → `1`
- `s = "pwwkew"` → `3` (`"wke"` — substring, not subsequence)

LeetCode 3 · [Link](https://leetcode.com/problems/longest-substring-without-repeating-characters/) · *Medium*

## Approach 1: Brute force — check every substring

Enumerate every substring and check uniqueness.

```python
def length_of_longest_substring(s: str) -> int:
    best = 0
    n = len(s)
    for i in range(n):
        for j in range(i, n):
            if len(set(s[i:j + 1])) == j - i + 1:
                best = max(best, j - i + 1)
    return best
```

**Complexity**
- **Time:** O(n³). O(n²) substrings × O(n) uniqueness check.
- **Space:** O(n) for the set per check.

## Approach 2: Expanding window with set (check uniqueness incrementally)

For each starting index, expand rightward while the next character isn't already in the set.

```python
def length_of_longest_substring(s: str) -> int:
    n = len(s)
    best = 0
    for i in range(n):
        seen = set()
        for j in range(i, n):
            if s[j] in seen:
                break
            seen.add(s[j])
        best = max(best, len(seen))
    return best
```

**Complexity**
- **Time:** O(n²). Outer loop × inner linear work.
- **Space:** O(k) where k = distinct characters (≤ alphabet size).

Better than brute force, still not optimal.

## Approach 3: Sliding window with last-seen map (optimal)

Maintain `left` (start of the current valid window) and a hash map `last_seen[ch] = index`. When the current character was last seen *inside* the current window, jump `left` to just past that last-seen index.

```python
def length_of_longest_substring(s: str) -> int:
    last_seen = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best
```

**Complexity**
- **Time:** O(n). One pass; every index visited once.
- **Space:** O(k). Hash map bounded by alphabet size.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n³) | O(n) |
| Expanding window | O(n²) | O(k) |
| **Sliding window + last-seen** | **O(n)** | **O(k)** |

The optimal approach is a variable-size sliding window whose invariant (no repeats in `[left, right]`) is preserved by jumping `left` instead of decrementing. Same pattern solves many substring problems.

## Related data structures

- [Strings](../../../data-structures/strings/) — input
- [Hash Tables](../../../data-structures/hash-tables/) — last-seen index map (the optimal-pattern enabler)
