---
title: "49. Group Anagrams"
description: Group strings that are anagrams of each other.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, strings, hash-tables, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array of strings `strs`, group the anagrams together. You can return the groups in any order.

**Example**
- `strs = ["eat","tea","tan","ate","nat","bat"]` → `[["bat"], ["nat","tan"], ["ate","eat","tea"]]`
- `strs = [""]` → `[[""]]`
- `strs = ["a"]` → `[["a"]]`

LeetCode 49 · [Link](https://leetcode.com/problems/group-anagrams/) · *Medium*

## Approach 1: Brute force, pairwise anagram check

For each string, compare its character count against representatives of existing groups.

```python
from collections import Counter

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = []
    for s in strs:
        cs = Counter(s)
        placed = False
        for g in groups:
            if Counter(g[0]) == cs:
                g.append(s)
                placed = True
                break
        if not placed:
            groups.append([s])
    return groups
```

**Complexity**
- **Time:** O(n² · k). For each of `n` strings, we compare against up to `n` groups; each comparison is O(k) where `k` is the string length.
- **Space:** O(n · k) for the output plus counters.

## Approach 2: Sorted-string as hash key

Anagrams share the same multiset of characters; their sorted form is identical. Use the sorted string as a hash map key.

```python
from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = "".join(sorted(s))
        groups[key].append(s)
    return list(groups.values())
```

**Complexity**
- **Time:** O(n · k log k). Sorting each string of length `k` takes O(k log k).
- **Space:** O(n · k) for keys + output.

## Approach 3: Char-count tuple as key (optimal for bounded alphabet)

Skip sorting entirely; a 26-slot frequency tuple is a cheaper, immutable key.

```python
from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        count = [0] * 26
        for ch in s:
            count[ord(ch), ord('a')] += 1
        groups[tuple(count)].append(s)
    return list(groups.values())
```

**Complexity**
- **Time:** O(n · k). Linear per string, strictly better than the sort-key approach.
- **Space:** O(n · k) for the output; O(n) hash map slots of fixed-size (26) keys.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Pairwise Counter compare | O(n² · k) | O(n · k) |
| Sorted-string key | O(n · k log k) | O(n · k) |
| **Char-count tuple key** | **O(n · k)** | O(n · k) |

For bounded alphabets, the count-tuple approach is the tightest. For huge or unbounded alphabets, the sort-key version is simpler and often fast enough.

## Related data structures

- [Strings](../../../data-structures/strings/), input type; character-frequency canonicalization
- [Hash Tables](../../../data-structures/hash-tables/), grouping by a canonical key is the core idea
