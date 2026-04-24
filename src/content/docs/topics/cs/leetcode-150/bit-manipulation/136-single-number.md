---
title: "136. Single Number"
description: Find the element that appears once in an array where every other element appears twice.
parent: bit-manipulation
tags: [leetcode, neetcode-150, bit-manipulation, xor, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a non-empty array of integers `nums` where every element appears twice except for one, find that single one. Solve in O(n) time and **O(1) extra space**.

**Example**
- `nums = [2, 2, 1]` → `1`
- `nums = [4, 1, 2, 1, 2]` → `4`
- `nums = [1]` → `1`

LeetCode 136 · [Link](https://leetcode.com/problems/single-number/) · *Easy*

## Approach 1: Hash set

Track elements; add on first sight, remove on second. The remainder is the answer.

```python
def single_number(nums):
    seen = set()
    for x in nums:
        if x in seen:
            seen.remove(x)
        else:
            seen.add(x)
    return seen.pop()
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

Violates the O(1) space constraint.

## Approach 2: Sort + scan pairs

Sort; any non-pair is the answer.

```python
def single_number(nums):
    nums.sort()
    for i in range(0, len(nums) - 1, 2):
        if nums[i] != nums[i + 1]:
            return nums[i]
    return nums[-1]
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(1) with in-place sort.

## Approach 3: XOR everything (optimal)

`a ^ a = 0` and `a ^ 0 = a`. XOR all elements; duplicates cancel, leaving the unique.

```python
def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result

# Or:
# from functools import reduce
# from operator import xor
# return reduce(xor, nums)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Hash set | O(n) | O(n) |
| Sort + scan | O(n log n) | O(1) |
| **XOR** | **O(n)** | **O(1)** |

XOR is the canonical bit-manipulation move — memorize it. Variants (Single Number II with triples, III with two singletons) build on this.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — input; XOR accumulator (no extra structures)
