---
title: "287. Find the Duplicate Number"
description: Find the duplicate in an array of n+1 integers, each in range [1, n], without modifying the array and in O(1) space.
parent: linked-list
tags: [leetcode, neetcode-150, arrays, linked-lists, two-pointers, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array `nums` of `n + 1` integers where each value is in the range `[1, n]`, there is exactly one number that appears two or more times. Find that number.

Constraints:
- You must **not** modify the array.
- You must use only constant extra space.
- The runtime must be less than O(n²).

**Example**
- `nums = [1,3,4,2,2]` → `2`
- `nums = [3,1,3,4,2]` → `3`
- `nums = [3,3,3,3,3]` → `3`

LeetCode 287 · [Link](https://leetcode.com/problems/find-the-duplicate-number/) · *Medium*

## Approach 1: Brute force, sort

Sort the array; the duplicate sits next to one of its copies.

```python
def find_duplicate(nums):
    nums_sorted = sorted(nums)
    for i in range(1, len(nums_sorted)):
        if nums_sorted[i] == nums_sorted[i, 1]:
            return nums_sorted[i]
    return -1
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(n) (Python sort copies).

Violates "don't modify" *in spirit* (we're using a sorted copy, but the problem usually permits non-destructive). Fails the O(1) space constraint.

## Approach 2: Hash set

Walk once, checking a set.

```python
def find_duplicate(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return x
        seen.add(x)
    return -1
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

Fails the O(1) space constraint.

## Approach 3: Floyd's cycle detection on array-as-linked-list (optimal)

Treat `i → nums[i]` as a linked-list transition. With values in `[1, n]` and an array of length `n + 1`, a duplicate value creates a cycle in this implicit linked list. The *entry* of the cycle is the duplicate.

Standard Floyd's: phase 1 finds a point inside the cycle; phase 2 resets one pointer to the start and walks both by one, they meet at the cycle entrance.

```python
def find_duplicate(nums):
    # Phase 1: find meeting point inside the cycle
    slow = nums[0]
    fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    # Phase 2: find the entrance of the cycle
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

### Why array-as-linked-list works
`nums[i]` is in `[1, n]`, so it's always a valid next index. Starting from index 0, you can't revisit 0 (since no `nums[i] == 0`), so any cycle you encounter must begin at the *duplicate* value, every other value has exactly one predecessor.

## Summary

| Approach | Time | Space | Meets constraints? |
| --- | --- | --- | --- |
| Sort | O(n log n) | O(n) | ✗ |
| Hash set | O(n) | O(n) | ✗ |
| **Floyd's on array-as-list** | **O(n)** | **O(1)** | ✓ |

This is a classic "looks like an array problem, solved with a linked-list algorithm" puzzle. Recognizing the array-as-linked-list framing is the key.

## Related data structures

- [Arrays](../../../data-structures/arrays/), input; indexed as implicit linked list
- [Linked Lists](../../../data-structures/linked-lists/), Floyd's tortoise and hare
