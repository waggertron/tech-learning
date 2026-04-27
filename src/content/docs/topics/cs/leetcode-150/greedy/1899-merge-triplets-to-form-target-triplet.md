---
title: "1899. Merge Triplets to Form Target Triplet (Medium)"
description: Using element-wise max over a subset of triplets, can you produce a given target triplet?
parent: greedy
tags: [leetcode, neetcode-150, greedy, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a list of triplets and a `target` triplet, you may pick a subset and take element-wise max to produce a new triplet. Return `true` if you can produce exactly `target`.

**Example**
- `triplets = [[2,5,3],[1,8,4],[1,7,5]]`, `target = [2,7,5]` → `true` ([2,5,3] + [1,7,5])
- `triplets = [[1,3,4],[2,5,8]]`, `target = [2,5,8]` → `true`
- `triplets = [[3,4,5]]`, `target = [2,5,8]` → `false`

LeetCode 1899 · [Link](https://leetcode.com/problems/merge-triplets-to-form-target-triplet/) · *Medium*

## Approach 1: Brute force, enumerate subsets

Check the element-wise max of every subset. Exponential, skip.

## Approach 2: Greedy channel-wise (canonical)

A triplet `(a, b, c)` is "usable" iff **every channel is ≤ target**. If any channel exceeds target, including it pushes that channel past the answer and can't be undone.

Among usable triplets, check that each of the three channels gets at least one triplet achieving that target channel.

```python
def merge_triplets(triplets, target):
    hit = [False, False, False]                         # L1: O(1)
    for t in triplets:                                  # L2: single pass, n iterations
        if t[0] > target[0] or t[1] > target[1] or t[2] > target[2]:  # L3: O(1)
            continue
        for i in range(3):                              # L4: O(1), constant 3 channels
            if t[i] == target[i]:
                hit[i] = True                           # L5: O(1)
    return all(hit)                                     # L6: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(triplets).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| **L2, L3, L4, L5 (scan)** | **O(1)** | **n** | **O(n)** ← dominates |
| L6 (all check) | O(1) | 1 | O(1) |

Each triplet is visited once; the inner channel loop is constant (always 3 channels).

**Complexity**
- **Time:** O(n), driven by L2/L3/L4/L5 (single pass over all triplets).
- **Space:** O(1).

### Why greedy works
Element-wise max is monotone, once a channel equals the target, subsequent usable triplets can't reduce it below target. So we just need one usable triplet per channel hitting the target value.

## Approach 3: Early-exit variant

Same as Approach 2 with an early return when all three hits are set.

```python
def merge_triplets_early(triplets, target):
    hit = 0                                             # L1: O(1), bitmask
    for t in triplets:                                  # L2: single pass, n iterations
        if t[0] > target[0] or t[1] > target[1] or t[2] > target[2]:  # L3: O(1)
            continue
        for i in range(3):                              # L4: O(1)
            if t[i] == target[i]:
                hit |= 1 << i                           # L5: O(1)
        if hit == 0b111:                                # L6: O(1) early exit
            return True
    return hit == 0b111
```

**Where the time goes, line by line**

*Variables: n = len(triplets).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L2-L5 (scan)** | **O(1)** | **up to n** | **O(n)** ← dominates |
| L6 (early exit check) | O(1) | up to n | O(n) |

Same asymptotic complexity as Approach 2 with a constant-factor speedup on lucky inputs where all three channels are hit early.

**Complexity**
- Same as Approach 2 with constant-factor speedup on lucky inputs.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate subsets | exponential | O(n) |
| **Greedy channel-wise** | **O(n)** | **O(1)** |

The "filter then hit each dimension" greedy pattern generalizes to K channels.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_1899.py and run.
# Uses the canonical implementation (Approach 2: greedy channel-wise).

def merge_triplets(triplets, target):
    hit = [False, False, False]
    for t in triplets:
        if t[0] > target[0] or t[1] > target[1] or t[2] > target[2]:
            continue
        for i in range(3):
            if t[i] == target[i]:
                hit[i] = True
    return all(hit)

def _run_tests():
    assert merge_triplets([[2,5,3],[1,8,4],[1,7,5]], [2,7,5]) == True
    assert merge_triplets([[1,3,4],[2,5,8]], [2,5,8]) == True
    assert merge_triplets([[3,4,5]], [2,5,8]) == False    # overshoots channel 0
    assert merge_triplets([[1,1,1]], [1,1,1]) == True     # single triplet matches target
    assert merge_triplets([[1,0,0],[0,1,0],[0,0,1]], [1,1,1]) == True  # each channel from different triplet
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), channel-wise scan
