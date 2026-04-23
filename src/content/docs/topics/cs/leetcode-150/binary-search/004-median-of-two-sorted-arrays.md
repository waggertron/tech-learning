---
title: "4. Median of Two Sorted Arrays"
description: Find the median of two sorted arrays in O(log(min(m, n))).
parent: binary-search
tags: [leetcode, neetcode-150, binary-search, arrays, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two sorted arrays `nums1` and `nums2` of sizes `m` and `n`, return the median of the combined sorted array. The algorithm must run in **O(log(min(m, n)))**.

**Example**
- `nums1 = [1, 3]`, `nums2 = [2]` → `2.0`
- `nums1 = [1, 2]`, `nums2 = [3, 4]` → `2.5`

LeetCode 4 · [Link](https://leetcode.com/problems/median-of-two-sorted-arrays/) · *Hard*

## Approach 1: Brute force — merge, then index

Merge the two sorted arrays into one, then return the middle element(s).

```python
def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    merged = sorted(nums1 + nums2)
    total = len(merged)
    mid = total // 2
    if total % 2 == 0:
        return (merged[mid - 1] + merged[mid]) / 2
    return merged[mid]
```

**Complexity**
- **Time:** O((m + n) log(m + n)).
- **Space:** O(m + n).

Fails the required O(log(min(m, n))) time.

## Approach 2: Two-pointer merge to the median (no full merge)

Instead of merging completely, walk both arrays with two pointers and stop at the median index.

```python
def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    m, n = len(nums1), len(nums2)
    total = m + n
    need = total // 2 + 1   # we need the (total//2)th and (total//2 - 1)th in even case

    i = j = 0
    prev = cur = 0
    for _ in range(need):
        prev = cur
        if i < m and (j >= n or nums1[i] <= nums2[j]):
            cur = nums1[i]
            i += 1
        else:
            cur = nums2[j]
            j += 1

    return cur if total % 2 == 1 else (prev + cur) / 2
```

**Complexity**
- **Time:** O(m + n).
- **Space:** O(1).

Still doesn't meet the target complexity.

## Approach 3: Binary search partition (optimal)

The trick: find a partition index `i` in `nums1` and corresponding `j = (m + n + 1) // 2 - i` in `nums2` such that:

- Everything on the left (`nums1[:i]` and `nums2[:j]`) is ≤ everything on the right (`nums1[i:]` and `nums2[j:]`).
- The left half contains exactly `(m + n + 1) // 2` elements.

Binary-search `i` on the shorter array.

```python
def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    # Ensure nums1 is the shorter
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    half = (m + n + 1) // 2

    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = half - i

        a_left  = nums1[i - 1] if i > 0 else float('-inf')
        a_right = nums1[i]     if i < m else float('inf')
        b_left  = nums2[j - 1] if j > 0 else float('-inf')
        b_right = nums2[j]     if j < n else float('inf')

        if a_left <= b_right and b_left <= a_right:
            if (m + n) % 2 == 1:
                return max(a_left, b_left)
            return (max(a_left, b_left) + min(a_right, b_right)) / 2
        elif a_left > b_right:
            hi = i - 1
        else:
            lo = i + 1
    return 0.0   # unreachable for valid input
```

**Complexity**
- **Time:** **O(log(min(m, n)))**.
- **Space:** O(1).

### Why it works
We're searching for the correct horizontal "cut" that divides the conceptual merged array in half. The invariants `a_left <= b_right` and `b_left <= a_right` together guarantee the left side has all the smaller elements. Because the two arrays are sorted, overshoot/undershoot each have a clean correction.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Merge sort | O((m+n) log(m+n)) | O(m+n) |
| Walk to median | O(m+n) | O(1) |
| **Partition binary search** | **O(log(min(m, n)))** | **O(1)** |

This is the canonical "hard" binary-search problem. Once you see the partition invariant, the bookkeeping is mechanical; the first time through, it feels like magic.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — two sorted arrays; partition-based binary search
