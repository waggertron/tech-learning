---
title: Arrays
description: Contiguous, index-addressable memory. The most fundamental and widely used data structure in interviews — many other structures are built on top of it.
parent: data-structures
tags: [data-structures, arrays, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

An array is a contiguous block of memory storing elements of the same type, indexed from 0. Because elements are contiguous and fixed-size, the offset of any index can be computed in constant time — which makes random access O(1). Arrays are the substrate beneath many higher-level data structures (strings, stacks, queues, heaps, hash-table buckets), so time spent mastering array manipulation pays off everywhere.

## In-depth description

A **static array** has a fixed size chosen at allocation time (C `int a[10]`). A **dynamic array** — Python `list`, Java `ArrayList`, C++ `std::vector`, Go `slice`, JavaScript `Array` — resizes automatically, typically by **doubling capacity** when the backing store fills up. This gives amortized O(1) append: most appends are O(1), with the occasional O(n) copy amortized across the preceding n cheap appends.

Because elements are contiguous, inserting or deleting in the middle requires shifting everything after that index — O(n). If the array is sorted, binary search reduces lookup to O(log n). Many interview problems exploit one of three array-specific patterns:

- **Two pointers** — walk from both ends or at different speeds; common when the array is sorted or when pairing elements.
- **Sliding window** — maintain a contiguous range `[left, right]` and move the boundaries to satisfy a constraint; converts many O(n²) brute forces to O(n).
- **Prefix sums** — precompute `prefix[i] = sum of elements up to i` once, then answer any range-sum query in O(1).

Multi-dimensional arrays are rows-of-rows (C-style), or use strides for O(1) slicing (NumPy). In-place algorithms (Dutch National Flag, reverse, rotate) are a frequent source of interview questions because they force careful pointer bookkeeping.

## Time complexity

| Operation | Average | Worst |
| --- | --- | --- |
| Access by index | O(1) | O(1) |
| Search (unsorted) | O(n) | O(n) |
| Search (sorted, binary) | O(log n) | O(log n) |
| Append (dynamic array) | O(1) amortized | O(n) (resize) |
| Insert at index | O(n) | O(n) |
| Delete at index | O(n) | O(n) |
| Space | O(n) | O(n) |

## Common uses in DSA

1. **Two-pointer problems** — Two Sum II (sorted), Valid Palindrome, 3Sum, Container With Most Water.
2. **Sliding window** — Longest Substring Without Repeating Characters, Maximum Sum Subarray of Size K, Minimum Size Subarray Sum.
3. **Binary search on an array or on the answer** — Search in Rotated Sorted Array, Find Peak Element, Koko Eating Bananas, Median of Two Sorted Arrays.
4. **Prefix sums / difference arrays** — Range Sum Query, Subarray Sum Equals K, Product of Array Except Self.
5. **In-place rearrangement and sorting** — Dutch National Flag (Sort Colors), Move Zeroes, Rotate Array, Next Permutation.

**Canonical LeetCode problems:** #1 Two Sum, #11 Container With Most Water, #15 3Sum, #42 Trapping Rain Water, #53 Maximum Subarray, #56 Merge Intervals, #238 Product of Array Except Self.

## Python example

```python
# Dynamic array basics
arr = [1, 2, 3]
arr.append(4)           # O(1) amortized
arr.insert(0, 0)        # O(n) — shifts everything right
arr.pop()               # O(1) from end
arr.pop(0)              # O(n) from front

# Two-pointer: Two Sum on a sorted array
def two_sum_sorted(nums, target):
    l, r = 0, len(nums) - 1
    while l < r:
        s = nums[l] + nums[r]
        if s == target:
            return [l, r]
        if s < target:
            l += 1
        else:
            r -= 1
    return [-1, -1]

# Sliding window: longest substring with at most k distinct characters
from collections import Counter
def longest_k_distinct(s, k):
    counts, left, best = Counter(), 0, 0
    for right, ch in enumerate(s):
        counts[ch] += 1
        while len(counts) > k:
            counts[s[left]] -= 1
            if counts[s[left]] == 0:
                del counts[s[left]]
            left += 1
        best = max(best, right - left + 1)
    return best

# Binary search over a sorted array
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# Prefix sums: answer range-sum queries in O(1) after O(n) preprocessing
def range_sum_array(nums):
    prefix = [0] * (len(nums) + 1)
    for i, x in enumerate(nums):
        prefix[i + 1] = prefix[i] + x
    def range_sum(i, j):   # inclusive sum of nums[i..j]
        return prefix[j + 1] - prefix[i]
    return range_sum
```

## LeetCode problems

**NeetCode 150 — Arrays & Hashing:**
- [217. Contains Duplicate](../../leetcode-150/arrays-and-hashing/217-contains-duplicate/)
- [1. Two Sum](../../leetcode-150/arrays-and-hashing/001-two-sum/)
- [347. Top K Frequent Elements](../../leetcode-150/arrays-and-hashing/347-top-k-frequent-elements/)
- [238. Product of Array Except Self](../../leetcode-150/arrays-and-hashing/238-product-of-array-except-self/)
- [36. Valid Sudoku](../../leetcode-150/arrays-and-hashing/036-valid-sudoku/)
- [271. Encode and Decode Strings](../../leetcode-150/arrays-and-hashing/271-encode-and-decode-strings/)
- [128. Longest Consecutive Sequence](../../leetcode-150/arrays-and-hashing/128-longest-consecutive-sequence/)

**NeetCode 150 — Two Pointers:**
- [167. Two Sum II — Input Array Is Sorted](../../leetcode-150/two-pointers/167-two-sum-ii/)
- [15. 3Sum](../../leetcode-150/two-pointers/015-3sum/)
- [11. Container With Most Water](../../leetcode-150/two-pointers/011-container-with-most-water/)
- [42. Trapping Rain Water](../../leetcode-150/two-pointers/042-trapping-rain-water/)

**NeetCode 150 — Sliding Window:**
- [121. Best Time to Buy and Sell Stock](../../leetcode-150/sliding-window/121-best-time-to-buy-and-sell-stock/)
- [239. Sliding Window Maximum](../../leetcode-150/sliding-window/239-sliding-window-maximum/)

*More categories coming soon — Binary Search, DP, etc.*

## References

- [Array — Wikipedia](https://en.wikipedia.org/wiki/Array_(data_structure))
- [Dynamic array amortization — CLRS Ch. 17](https://en.wikipedia.org/wiki/Amortized_analysis)
- [Two-pointer technique — LeetCode](https://leetcode.com/tag/two-pointers/)
- [Sliding window pattern — NeetCode](https://neetcode.io/roadmap)
