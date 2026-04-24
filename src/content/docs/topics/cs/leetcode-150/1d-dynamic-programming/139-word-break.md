---
title: "139. Word Break"
description: Determine whether a string can be segmented into space-separated words from a given dictionary.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, hash-tables, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.

**Example**
- `s = "leetcode"`, `wordDict = ["leet", "code"]` → `true`
- `s = "applepenapple"`, `wordDict = ["apple", "pen"]` → `true`
- `s = "catsandog"`, `wordDict = ["cats", "dog", "sand", "and", "cat"]` → `false`

LeetCode 139 · [Link](https://leetcode.com/problems/word-break/) · *Medium*

## Approach 1: Recursive, try every prefix

```python
def word_break(s, word_dict):
    words = set(word_dict)
    def f(start):
        if start == len(s):
            return True
        for end in range(start + 1, len(s) + 1):
            if s[start:end] in words and f(end):
                return True
        return False
    return f(0)
```

**Complexity**
- **Time:** O(2ⁿ).
- **Space:** O(n).

## Approach 2: Top-down memoized

Cache by start index.

```python
from functools import lru_cache

def word_break(s, word_dict):
    words = set(word_dict)
    @lru_cache(maxsize=None)
    def f(start):
        if start == len(s):
            return True
        for end in range(start + 1, len(s) + 1):
            if s[start:end] in words and f(end):
                return True
        return False
    return f(0)
```

**Complexity**
- **Time:** O(n² · L) where L = max word length.
- **Space:** O(n).

## Approach 3: Bottom-up DP (canonical)

`dp[i] = True` iff `s[:i]` can be segmented. `dp[0] = True`; `dp[i] = any(dp[j] and s[j:i] in words for j < i)`.

```python
def word_break(s, word_dict):
    words = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[n]
```

**Complexity**
- **Time:** O(n² · L).
- **Space:** O(n).

### Optimization
Limit the inner loop to `j >= i, max_word_length`. Saves time when dictionary words are short relative to `s`.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2ⁿ) | O(n) |
| Top-down memo | O(n² · L) | O(n) |
| **Bottom-up DP** | **O(n² · L)** | **O(n)** |

The "partition a string into dictionary pieces" template applies to Word Break II (140, which enumerates all segmentations) and Concatenated Words (472).

## Related data structures

- [Strings](../../../data-structures/strings/), prefix DP
- [Hash Tables](../../../data-structures/hash-tables/), O(1) dictionary membership
