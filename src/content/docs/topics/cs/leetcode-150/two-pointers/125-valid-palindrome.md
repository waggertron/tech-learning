---
title: "125. Valid Palindrome"
description: Determine if a string is a palindrome, considering only alphanumeric characters and ignoring case.
parent: two-pointers
tags: [leetcode, neetcode-150, strings, two-pointers, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s`, return `true` if it reads the same forwards and backwards **after** removing non-alphanumeric characters and lowercasing the rest.

**Examples**
- `s = "A man, a plan, a canal: Panama"` → `true`
- `s = "race a car"` → `false`
- `s = " "` → `true` (empty after cleaning)

LeetCode 125 · [Link](https://leetcode.com/problems/valid-palindrome/) · *Easy*

## Approach 1: Brute force — clean, then compare to reverse

Filter to alphanumerics, lowercase, and compare to the reversed string.

```python
def is_palindrome(s: str) -> bool:
    cleaned = "".join(ch.lower() for ch in s if ch.isalnum())
    return cleaned == cleaned[::-1]
```

**Complexity**
- **Time:** O(n). Two linear passes.
- **Space:** O(n). The cleaned string and its reverse.

Direct and clear — but uses an extra O(n) allocation where O(1) is achievable.

## Approach 2: Clean, then two pointers

Build the cleaned string, then walk from both ends. Same asymptotics as Approach 1 with an early-exit on the first mismatch.

```python
def is_palindrome(s: str) -> bool:
    cleaned = [ch.lower() for ch in s if ch.isalnum()]
    l, r = 0, len(cleaned) - 1
    while l < r:
        if cleaned[l] != cleaned[r]:
            return False
        l, r = l + 1, r - 1
    return True
```

**Complexity**
- **Time:** O(n). Best case O(1) (first mismatch).
- **Space:** O(n). The cleaned list.

## Approach 3: Two pointers, skip non-alphanumerics in-place (optimal)

Walk both ends of the original string, skipping over non-alphanumeric characters on the fly. No extra allocation.

```python
def is_palindrome(s: str) -> bool:
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l, r = l + 1, r - 1
    return True
```

**Complexity**
- **Time:** O(n). Each index is visited at most once.
- **Space:** O(1). No auxiliary structures.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Clean + reverse compare | O(n) | O(n) |
| Clean + two pointers | O(n) | O(n) |
| **Two pointers in place** | **O(n)** | **O(1)** |

Same Big-O on time, but the in-place two-pointer version is the canonical "optimal-space" answer.

## Related data structures

- [Strings](../../../data-structures/strings/) — input; in-place traversal with `isalnum`
