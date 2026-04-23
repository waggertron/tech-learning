---
title: "424. Longest Repeating Character Replacement"
description: Given a string and k, find the longest substring you can make uniform by replacing up to k characters.
parent: sliding-window
tags: [leetcode, neetcode-150, strings, sliding-window, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s` and an integer `k`, return the length of the longest substring containing the same letter after you perform at most `k` character replacements. You may choose which letter to make the string uniform with.

**Example**
- `s = "ABAB"`, `k = 2` → `4` (replace both A's with B or both B's with A)
- `s = "AABABBA"`, `k = 1` → `4` (replace the `B` at index 3; substring `"AABA"` + replacement = `"AAAA"`)

LeetCode 424 · [Link](https://leetcode.com/problems/longest-repeating-character-replacement/) · *Medium*

## Approach 1: Brute force — try every substring

For each substring, count characters and check that `(length - max_count) ≤ k`.

```python
def character_replacement(s: str, k: int) -> int:
    from collections import Counter
    n = len(s)
    best = 0
    for i in range(n):
        for j in range(i, n):
            counts = Counter(s[i:j + 1])
            length = j - i + 1
            if length - max(counts.values()) <= k:
                best = max(best, length)
    return best
```

**Complexity**
- **Time:** O(n³). O(n²) substrings × O(n) counting.
- **Space:** O(k) where k = alphabet size.

## Approach 2: Per-target-letter sliding window

For each possible target letter (A–Z, so at most 26), slide a window that keeps the count of non-target characters ≤ k.

```python
def character_replacement(s: str, k: int) -> int:
    best = 0
    for target in set(s):
        left = 0
        non_target = 0
        for right in range(len(s)):
            if s[right] != target:
                non_target += 1
            while non_target > k:
                if s[left] != target:
                    non_target -= 1
                left += 1
            best = max(best, right - left + 1)
    return best
```

**Complexity**
- **Time:** O(26 · n) = O(n).
- **Space:** O(1).

Already optimal in Big-O; the third approach drops the constant factor of 26.

## Approach 3: Single sliding window with running max-frequency (optimal)

Maintain one window and a count of each character in it. Track `max_freq` — the most frequent character in the window. Shrinking is needed when `(window_length - max_freq) > k`.

Key insight: we never need to *decrease* `max_freq` as `left` advances. A smaller max-freq would only matter if it produced a *larger* window, which the current `best` already captured.

```python
def character_replacement(s: str, k: int) -> int:
    from collections import Counter
    counts = Counter()
    left = 0
    max_freq = 0
    best = 0
    for right, ch in enumerate(s):
        counts[ch] += 1
        max_freq = max(max_freq, counts[ch])
        while (right - left + 1) - max_freq > k:
            counts[s[left]] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best
```

**Complexity**
- **Time:** O(n). One pass; `left` and `right` each advance at most n times total.
- **Space:** O(k) for the counter (at most alphabet size).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n³) | O(k) |
| Per-letter sliding window | O(26 · n) = O(n) | O(1) |
| **Single sliding window** | **O(n)** | O(k) |

The max-freq trick is the hallmark of this problem — it lets us skip the "decrement max_freq when shrinking" step entirely, because it only affects candidate windows that are shorter than what we've already seen.

## Related data structures

- [Strings](../../../data-structures/strings/) — input
- [Hash Tables](../../../data-structures/hash-tables/) — frequency counts inside the window
