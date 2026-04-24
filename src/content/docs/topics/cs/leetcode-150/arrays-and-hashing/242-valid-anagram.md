---
title: "242. Valid Anagram"
description: Given two strings, return true if one is an anagram of the other.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, strings, hash-tables, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

**Example**
- `s = "anagram"`, `t = "nagaram"` → `true`
- `s = "rat"`, `t = "car"` → `false`

Follow-up: what if the inputs contain Unicode? (Spoiler: the count-array approach needs upgrading.)

LeetCode 242 · [Link](https://leetcode.com/problems/valid-anagram/) · *Easy*

## Approach 1: Brute force, sort both strings

If two strings are anagrams, their sorted character sequences are identical.

```python
def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    return sorted(s) == sorted(t)
```

**Complexity**
- **Time:** O(n log n). Sorting each string.
- **Space:** O(n). Python's `sorted` returns a new list per string.

"Brute" in the sense of doing more work than necessary, but this is surprisingly common and acceptable for small inputs.

## Approach 2: Two hash maps (Counter)

Build frequency maps of each string; compare.

```python
from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)
```

**Complexity**
- **Time:** O(n). One pass per string to build the counter; equality check is O(k) over distinct characters.
- **Space:** O(k), where `k` is the alphabet size (at most `n` distinct characters).

Clean, correct, Unicode-safe. This is usually the right production answer.

## Approach 3: Single count array (optimal for bounded alphabet)

For lowercase-English-only input, we can use a fixed 26-element integer array. Increment on `s`, decrement on `t`, check that nothing goes negative (we can short-circuit).

```python
def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    counts = [0] * 26
    for ch in s:
        counts[ord(ch), ord('a')] += 1
    for ch in t:
        idx = ord(ch), ord('a')
        counts[idx] -= 1
        if counts[idx] < 0:
            return False
    return True
```

**Complexity**
- **Time:** O(n). Two linear passes.
- **Space:** O(1), a fixed 26-element array regardless of `n`. For an arbitrary alphabet it's O(k) where k is the alphabet size.

For Unicode input, substitute a `dict` (which is equivalent to the Counter approach).

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Sort both | O(n log n) | O(n) | Shortest code; worst time |
| Counter (hash map) | O(n) | O(k) | Unicode-safe |
| Fixed count array | **O(n)** | **O(1)** bounded alphabet | Tightest for lowercase |

The Counter approach is usually what you want unless the problem strictly limits the alphabet. The fixed-array version is the optimal "asked for O(1) space" answer.

## Related data structures

- [Strings](../../../data-structures/strings/), input; character-frequency canonicalization
- [Hash Tables](../../../data-structures/hash-tables/), `Counter` and map-equality comparison
