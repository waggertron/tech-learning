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

## Approach 1: Brute force, try every substring

For each substring, count characters and check that `(length, max_count) ≤ k`.

```python
def character_replacement(s: str, k: int) -> int:
    from collections import Counter
    n = len(s)
    best = 0
    for i in range(n):                           # L1: outer loop, n iterations
        for j in range(i, n):                    # L2: inner loop, O(n) per outer
            counts = Counter(s[i:j + 1])         # L3: slice + Counter, O(n) each
            length = j - i + 1
            if length - max(counts.values()) <= k:  # L4: O(k) max over counts
                best = max(best, length)         # L5: O(1)
    return best
```

**Where the time goes, line by line**

*Variables: n = len(s), k = number of distinct characters in s (≤ alphabet size, at most 26).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (outer loop) | O(1) | n | O(n) |
| L2 (inner loop) | O(1) | O(n²) total | O(n²) |
| **L3 (Counter build)** | **O(n)** | **O(n²)** | **O(n³)** ← dominates |
| L4 (max over counts) | O(k) | O(n²) | O(n² · k) |

L3 allocates a new slice and builds a Counter for every (i, j) pair, which is O(n) work done O(n²) times.

**Complexity**
- **Time:** O(n³), driven by L3 (Counter on every substring pair).
- **Space:** O(k) where k = alphabet size.

## Approach 2: Per-target-letter sliding window

For each possible target letter (A–Z, so at most 26), slide a window that keeps the count of non-target characters ≤ k.

```python
def character_replacement(s: str, k: int) -> int:
    best = 0
    for target in set(s):                   # L1: at most 26 targets
        left = 0
        non_target = 0
        for right in range(len(s)):         # L2: inner loop, n iterations per target
            if s[right] != target:          # L3: O(1) character check
                non_target += 1            # L4: O(1)
            while non_target > k:          # L5: shrink window
                if s[left] != target:
                    non_target -= 1        # L6: O(1)
                left += 1                  # L7: O(1)
            best = max(best, right - left + 1)  # L8: O(1)
    return best
```

**Where the time goes, line by line**

*Variables: n = len(s), k = number of distinct characters in s (≤ 26).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (targets loop) | O(1) | up to 26 | O(26) |
| **L2 (inner loop)** | **O(1) body** | **n per target** | **O(26n) = O(n)** ← dominates |
| L5-L7 (shrink) | O(1) amortized | at most n per target | O(26n) = O(n) |
| L8 (best update) | O(1) | n per target | O(26n) = O(n) |

The outer loop runs at most 26 times (26-character alphabet). For each target, `left` advances at most n times total across all iterations of L5-L7. So the total work per target is O(n), and O(26n) overall.

**Complexity**
- **Time:** O(26 · n) = O(n), driven by L2 (n iterations for each of the 26 targets).
- **Space:** O(1).

Already optimal in Big-O; the third approach drops the constant factor of 26.

## Approach 3: Single sliding window with running max-frequency (optimal)

Maintain one window and a count of each character in it. Track `max_freq`, the most frequent character in the window. Shrinking is needed when `(window_length, max_freq) > k`.

Key insight: we never need to *decrease* `max_freq` as `left` advances. A smaller max-freq would only matter if it produced a *larger* window, which the current `best` already captured.

```python
def character_replacement(s: str, k: int) -> int:
    from collections import Counter
    counts = Counter()
    left = 0
    max_freq = 0
    best = 0
    for right, ch in enumerate(s):                      # L1: outer loop, n iterations
        counts[ch] += 1                                  # L2: O(1)
        max_freq = max(max_freq, counts[ch])             # L3: O(1) running max
        while (right - left + 1) - max_freq > k:        # L4: shrink if too many replacements
            counts[s[left]] -= 1                        # L5: O(1)
            left += 1                                   # L6: O(1)
        best = max(best, right - left + 1)              # L7: O(1)
    return best
```

**Where the time goes, line by line**

*Variables: n = len(s), k = number of distinct characters in s (≤ 26).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (expand right)** | **O(1) body** | **n** | **O(n)** ← dominates |
| L2/L3 (update counts + max_freq) | O(1) | n | O(n) |
| L4-L6 (shrink left) | O(1) amortized | at most n total | O(n) |
| L7 (best update) | O(1) | n | O(n) |

The key insight for L3: we never decrease `max_freq` even when shrinking. This is safe because a smaller `max_freq` could only produce a window no larger than the current `best`, so there's no value in tracking the exact maximum after a shrink. `left` advances at most n times total across the whole run (amortized O(1) per step).

**Complexity**
- **Time:** O(n), driven by L1 (single pass; `left` and `right` each advance at most n times total).
- **Space:** O(k) for the counter (at most alphabet size).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n³) | O(k) |
| Per-letter sliding window | O(26 · n) = O(n) | O(1) |
| **Single sliding window** | **O(n)** | O(k) |

The max-freq trick is the hallmark of this problem, it lets us skip the "decrement max_freq when shrinking" step entirely, because it only affects candidate windows that are shorter than what we've already seen.

## Test cases

```python
# Quick smoke tests - paste into a REPL or save as test_424.py and run.
# Uses the optimal Approach 3 implementation.

from collections import Counter

def character_replacement(s: str, k: int) -> int:
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

def _run_tests():
    assert character_replacement("ABAB", 2) == 4      # replace both A's or both B's
    assert character_replacement("AABABBA", 1) == 4   # "AABA" with one replacement
    assert character_replacement("A", 0) == 1         # single char
    assert character_replacement("AAAA", 2) == 4      # already uniform
    assert character_replacement("ABCDE", 1) == 2     # any two adjacent, only 1 replacement
    assert character_replacement("AABBA", 2) == 5     # full string with 2 replacements
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Strings](../../../data-structures/strings/), input
- [Hash Tables](../../../data-structures/hash-tables/), frequency counts inside the window
