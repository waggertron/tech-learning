---
title: "4. Median of Two Sorted Arrays (Hard)"
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

## Approach 1: Brute force, merge, then index

Merge the two sorted arrays into one, then return the middle element(s).

```python
def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    merged = sorted(nums1 + nums2)    # L1: O((m+n) log(m+n)) sort
    total = len(merged)
    mid = total // 2
    if total % 2 == 0:
        return (merged[mid - 1] + merged[mid]) / 2   # L2: O(1) index
    return merged[mid]                                # L3: O(1) index
```

**Where the time goes, line by line**

*Variables: m = len(nums1), n = len(nums2).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (sort merged)** | **O((m+n) log(m+n))** | **1** | **O((m+n) log(m+n))** ← dominates |
| L2/L3 (index) | O(1) | 1 | O(1) |

Concatenating and sorting ignores the fact that both inputs are already sorted; a merge would be O(m+n), but Python's `sorted()` on an unsorted list is O((m+n) log(m+n)).

**Complexity**
- **Time:** O((m + n) log(m + n)), driven by L1 (sort of the merged array).
- **Space:** O(m + n).

Fails the required O(log(min(m, n))) time.

## Approach 2: Two-pointer merge to the median (no full merge)

Instead of merging completely, walk both arrays with two pointers and stop at the median index.

```python
def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    m, n = len(nums1), len(nums2)
    total = m + n
    need = total // 2 + 1           # L1: O(1)

    i = j = 0
    prev = cur = 0
    for _ in range(need):           # L2: advance (total//2 + 1) steps
        prev = cur
        if i < m and (j >= n or nums1[i] <= nums2[j]):
            cur = nums1[i]          # L3: O(1) take from nums1
            i += 1
        else:
            cur = nums2[j]          # L4: O(1) take from nums2
            j += 1

    return cur if total % 2 == 1 else (prev + cur) / 2   # L5: O(1)
```

**Where the time goes, line by line**

*Variables: m = len(nums1), n = len(nums2).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| **L2/L3/L4 (merge walk)** | **O(1)** | **(m+n)/2 + 1** | **O(m+n)** ← dominates |
| L5 (return) | O(1) | 1 | O(1) |

We only walk to the median position; no need to finish the merge. But the median is at position (m+n)/2, so we still advance O(m+n) steps in the worst case.

**Complexity**
- **Time:** O(m + n), driven by L2 (walk to the median position).
- **Space:** O(1).

Still doesn't meet the target complexity.

## Approach 3: Binary search partition (optimal)

The trick: find a partition index `i` in `nums1` and corresponding `j = (m + n + 1) // 2 - i` in `nums2` such that:

- Everything on the left (`nums1[:i]` and `nums2[:j]`) is ≤ everything on the right (`nums1[i:]` and `nums2[j:]`).
- The left half contains exactly `(m + n + 1) // 2` elements.

Binary-search `i` on the shorter array.

```python
def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    if len(nums1) > len(nums2):            # L1: ensure nums1 is shorter, O(1)
        nums1, nums2 = nums2, nums1
    m, n = len(nums1), len(nums2)
    half = (m + n + 1) // 2               # L2: O(1)

    lo, hi = 0, m                          # L3: binary search over [0, m]
    while lo <= hi:                        # L4: loop, O(log m) iterations
        i = (lo + hi) // 2                # L5: O(1) partition index for nums1
        j = half - i                      # L6: O(1) partition index for nums2

        a_left  = nums1[i - 1] if i > 0 else float('-inf')    # L7: O(1)
        a_right = nums1[i]     if i < m else float('inf')     # L8: O(1)
        b_left  = nums2[j - 1] if j > 0 else float('-inf')    # L9: O(1)
        b_right = nums2[j]     if j < n else float('inf')     # L10: O(1)

        if a_left <= b_right and b_left <= a_right:            # L11: O(1) check
            if (m + n) % 2 == 1:
                return max(a_left, b_left)
            return (max(a_left, b_left) + min(a_right, b_right)) / 2
        elif a_left > b_right:
            hi = i - 1                    # L12: O(1) cut too far right
        else:
            lo = i + 1                    # L13: O(1) cut too far left
    return 0.0   # unreachable for valid input
```

**Where the time goes, line by line**

*Variables: m = len(nums1), n = len(nums2), with m ≤ n guaranteed by L1.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (setup) | O(1) | 1 | O(1) |
| **L4-L13 (binary search loop)** | **O(1)** | **log m** | **O(log m)** ← dominates |

We binary-search only over `i` in `[0, m]`, the shorter array's partition. For each `i`, we compute `j` in O(1) and check the partition invariants in O(1). Each iteration halves the range, so the loop runs at most log(m+1) = O(log m) times.

**Complexity**
- **Time:** O(log(min(m, n))), driven by L4 (binary search over the shorter array's partition space).
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

## Test cases

```python
# Quick smoke tests - paste into a REPL or save as test_004.py and run.
# Uses the optimal Approach 3 implementation.

def find_median_sorted_arrays(nums1: list, nums2: list) -> float:
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
                return float(max(a_left, b_left))
            return (max(a_left, b_left) + min(a_right, b_right)) / 2
        elif a_left > b_right:
            hi = i - 1
        else:
            lo = i + 1
    return 0.0

def _run_tests():
    assert find_median_sorted_arrays([1, 3], [2]) == 2.0
    assert find_median_sorted_arrays([1, 2], [3, 4]) == 2.5
    assert find_median_sorted_arrays([0, 0], [0, 0]) == 0.0
    assert find_median_sorted_arrays([], [1]) == 1.0       # one array empty
    assert find_median_sorted_arrays([2], []) == 2.0       # other array empty
    assert find_median_sorted_arrays([1, 3], [2, 4]) == 2.5
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), two sorted arrays; partition-based binary search
