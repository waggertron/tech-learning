---
title: "242. Valid Anagram (Easy)"
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
    if len(s) != len(t):       # L1: O(1) length guard
        return False
    return sorted(s) == sorted(t)  # L2: O(n log n) sort each, O(n) compare
```

**Where the time goes, line by line**

*Variables: n = len(s) = len(t) (equal after the guard).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (length guard) | O(1) | 1 | O(1) |
| **L2 (sort + compare)** | **O(n log n)** | **1** | **O(n log n)** ← dominates |

Sorting each string costs O(n log n); the final equality check scans both sorted lists in O(n).

**Complexity**
- **Time:** O(n log n), driven by L2 (sorting each string).
- **Space:** O(n). Python's `sorted` returns a new list per string.

"Brute" in the sense of doing more work than necessary, but this is surprisingly common and acceptable for small inputs.

## Approach 2: Two hash maps (Counter)

Build frequency maps of each string; compare.

```python
from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)   # L1: O(n) build each + O(k) compare
```

**Where the time goes, line by line**

*Variables: n = len(s) (assuming len(s) = len(t)), k = number of distinct characters.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (build + compare)** | **O(n) + O(k)** | **1** | **O(n)** ← dominates |

Building each Counter is O(n); comparing two Counters is O(k) over distinct characters where k ≤ n.

**Complexity**
- **Time:** O(n), driven by L1 (Counter construction). One pass per string to build the counter; equality check is O(k) over distinct characters.
- **Space:** O(k), where `k` is the alphabet size (at most `n` distinct characters).

Clean, correct, Unicode-safe. This is usually the right production answer.

## Approach 3: Single count array (optimal for bounded alphabet)

For lowercase-English-only input, we can use a fixed 26-element integer array. Increment on `s`, decrement on `t`, check that nothing goes negative (we can short-circuit).

```python
def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):                    # L1: O(1) guard
        return False
    counts = [0] * 26                       # L2: O(1), fixed 26-slot array
    for ch in s:                            # L3: loop n iterations
        counts[ord(ch) - ord('a')] += 1    # L4: O(1) array index + increment
    for ch in t:                            # L5: loop n iterations
        idx = ord(ch) - ord('a')           # L6: O(1)
        counts[idx] -= 1                   # L7: O(1)
        if counts[idx] < 0:                # L8: O(1) early exit
            return False
    return True
```

**Where the time goes, line by line**

*Variables: n = len(s) = len(t) (equal after the guard).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (guard) | O(1) | 1 | O(1) |
| L2 (init array) | O(1) | 1 | O(1) |
| **L3, L4 (s frequency pass)** | **O(1)** | **n** | **O(n)** ← dominates |
| **L5-L8 (t decrement pass)** | **O(1)** | **n** | **O(n)** ← dominates |

Two linear passes of O(1) work each. The 26-slot array makes both passes O(n) total.

**Complexity**
- **Time:** O(n), driven by L3/L4 and L5-L8 (two linear passes). Two linear passes.
- **Space:** O(1), a fixed 26-element array regardless of `n`. For an arbitrary alphabet it's O(k) where k is the alphabet size.

For Unicode input, substitute a `dict` (which is equivalent to the Counter approach).

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Sort both | O(n log n) | O(n) | Shortest code; worst time |
| Counter (hash map) | O(n) | O(k) | Unicode-safe |
| Fixed count array | **O(n)** | **O(1)** bounded alphabet | Tightest for lowercase |

The Counter approach is usually what you want unless the problem strictly limits the alphabet. The fixed-array version is the optimal "asked for O(1) space" answer.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_valid_anagram.py and run.
# Uses the canonical implementation (Approach 3: fixed count array).

def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    counts = [0] * 26
    for ch in s:
        counts[ord(ch) - ord('a')] += 1
    for ch in t:
        idx = ord(ch) - ord('a')
        counts[idx] -= 1
        if counts[idx] < 0:
            return False
    return True

def _run_tests():
    assert is_anagram("anagram", "nagaram") == True
    assert is_anagram("rat", "car") == False
    assert is_anagram("a", "a") == True
    assert is_anagram("ab", "ba") == True
    assert is_anagram("ab", "a") == False
    assert is_anagram("", "") == True
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Strings](../../../data-structures/strings/), input; character-frequency canonicalization
- [Hash Tables](../../../data-structures/hash-tables/), `Counter` and map-equality comparison
