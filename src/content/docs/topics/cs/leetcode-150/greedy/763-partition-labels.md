---
title: "763. Partition Labels"
description: Partition a string so each letter appears in at most one piece; return the sizes of the pieces.
parent: greedy
tags: [leetcode, neetcode-150, greedy, hash-tables, strings, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s`, partition it into as many parts as possible so that each letter appears in at most one part. Return the sizes of the parts.

**Example**
- `s = "ababcbacadefegdehijhklij"` → `[9, 7, 8]`
- `s = "eccbbbbdec"` → `[10]`

LeetCode 763 · [Link](https://leetcode.com/problems/partition-labels/) · *Medium*

## Approach 1: Brute force — try all partition points

For each candidate split, verify that every character on the left never appears on the right. Quadratic.

## Approach 2: Precompute last-seen index + greedy extension (canonical)

Precompute `last[ch]` — the final index of each character. Walk the string; maintain a running `end` = the max `last[ch]` seen so far. When the walking index reaches `end`, the current window is the smallest valid partition ending at `end`.

```python
def partition_labels(s):
    last = {ch: i for i, ch in enumerate(s)}
    result = []
    start = end = 0
    for i, ch in enumerate(s):
        end = max(end, last[ch])
        if i == end:
            result.append(i - start + 1)
            start = i + 1
    return result
```

**Complexity**
- **Time:** O(n).
- **Space:** O(26) = O(1) for ASCII alphabets.

### Why greedy works
The moment the walking index equals `end`, every character in `[start, end]` is fully contained in the window (no later occurrence anywhere past `end`). So `[start, end]` is valid, and it's the **smallest** such window — any earlier cut would miss a later occurrence of some character.

## Approach 3: Union-Find / interval-merge formulation (conceptually equivalent)

Each character's first and last occurrence form an interval. Merge overlapping intervals; the merged sizes are the answer. Same O(n) via the same last-index trick — included as a conceptual map to problem 56 (Merge Intervals).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Try all splits | O(n²) | O(1) |
| **Last-seen + greedy extension** | **O(n)** | **O(1)** |

Pattern: "first index encountering a character starts its interval; `max(last[ch])` grows the window."

## Related data structures

- [Strings](../../../data-structures/strings/) — input
- [Hash Tables](../../../data-structures/hash-tables/) — `last[ch]` lookup
