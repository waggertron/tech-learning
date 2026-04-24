---
title: Arrays
description: Contiguous, index-addressable memory. The most fundamental and widely used data structure in interviews, many other structures are built on top of it.
parent: data-structures
tags: [data-structures, arrays, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

An array is a contiguous block of memory storing elements of the same type, indexed from 0. Because elements are contiguous and fixed-size, the offset of any index can be computed in constant time, which makes random access O(1). Arrays are the substrate beneath many higher-level data structures (strings, stacks, queues, heaps, hash-table buckets), so time spent mastering array manipulation pays off everywhere.

## In-depth description

A **static array** has a fixed size chosen at allocation time (C `int a[10]`). A **dynamic array**, Python `list`, Java `ArrayList`, C++ `std::vector`, Go `slice`, JavaScript `Array`, resizes automatically, typically by **doubling capacity** when the backing store fills up. This gives amortized O(1) append: most appends are O(1), with the occasional O(n) copy amortized across the preceding n cheap appends.

Because elements are contiguous, inserting or deleting in the middle requires shifting everything after that index, O(n). If the array is sorted, binary search reduces lookup to O(log n). Many interview problems exploit one of three array-specific patterns:

- **Two pointers**, walk from both ends or at different speeds; common when the array is sorted or when pairing elements.
- **Sliding window**, maintain a contiguous range `[left, right]` and move the boundaries to satisfy a constraint; converts many O(n²) brute forces to O(n).
- **Prefix sums**, precompute `prefix[i] = sum of elements up to i` once, then answer any range-sum query in O(1).

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

1. **Two-pointer problems**, Two Sum II (sorted), Valid Palindrome, 3Sum, Container With Most Water.
2. **Sliding window**, Longest Substring Without Repeating Characters, Maximum Sum Subarray of Size K, Minimum Size Subarray Sum.
3. **Binary search on an array or on the answer**, Search in Rotated Sorted Array, Find Peak Element, Koko Eating Bananas, Median of Two Sorted Arrays.
4. **Prefix sums / difference arrays**, Range Sum Query, Subarray Sum Equals K, Product of Array Except Self.
5. **In-place rearrangement and sorting**, Dutch National Flag (Sort Colors), Move Zeroes, Rotate Array, Next Permutation.

**Canonical LeetCode problems:** #1 Two Sum, #11 Container With Most Water, #15 3Sum, #42 Trapping Rain Water, #53 Maximum Subarray, #56 Merge Intervals, #238 Product of Array Except Self.

## Python example

```python
# Dynamic array basics
arr = [1, 2, 3]
arr.append(4)           # O(1) amortized
arr.insert(0, 0)        # O(n), shifts everything right
arr.pop()               # O(1) from end
arr.pop(0)              # O(n) from front

# Two-pointer: Two Sum on a sorted array
def two_sum_sorted(nums, target):
    l, r = 0, len(nums), 1
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
        best = max(best, right, left + 1)
    return best

# Binary search over a sorted array
def binary_search(nums, target):
    lo, hi = 0, len(nums), 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid, 1
    return -1

# Prefix sums: answer range-sum queries in O(1) after O(n) preprocessing
def range_sum_array(nums):
    prefix = [0] * (len(nums) + 1)
    for i, x in enumerate(nums):
        prefix[i + 1] = prefix[i] + x
    def range_sum(i, j):   # inclusive sum of nums[i..j]
        return prefix[j + 1], prefix[i]
    return range_sum
```

## LeetCode problems

Arrays are the most referenced data structure in the NeetCode 150, 74 problems across 17 categories.

**Arrays & Hashing:**
- [1. Two Sum](../../leetcode-150/arrays-and-hashing/001-two-sum/)
- [36. Valid Sudoku](../../leetcode-150/arrays-and-hashing/036-valid-sudoku/)
- [128. Longest Consecutive Sequence](../../leetcode-150/arrays-and-hashing/128-longest-consecutive-sequence/)
- [217. Contains Duplicate](../../leetcode-150/arrays-and-hashing/217-contains-duplicate/)
- [238. Product of Array Except Self](../../leetcode-150/arrays-and-hashing/238-product-of-array-except-self/)
- [271. Encode and Decode Strings](../../leetcode-150/arrays-and-hashing/271-encode-and-decode-strings/)
- [347. Top K Frequent Elements](../../leetcode-150/arrays-and-hashing/347-top-k-frequent-elements/)

**Two Pointers:**
- [11. Container With Most Water](../../leetcode-150/two-pointers/011-container-with-most-water/)
- [15. 3Sum](../../leetcode-150/two-pointers/015-3sum/)
- [42. Trapping Rain Water](../../leetcode-150/two-pointers/042-trapping-rain-water/)
- [167. Two Sum II, Input Array Is Sorted](../../leetcode-150/two-pointers/167-two-sum-ii/)

**Sliding Window:**
- [121. Best Time to Buy and Sell Stock](../../leetcode-150/sliding-window/121-best-time-to-buy-and-sell-stock/)
- [239. Sliding Window Maximum](../../leetcode-150/sliding-window/239-sliding-window-maximum/)

**Stack:**
- [84. Largest Rectangle in Histogram](../../leetcode-150/stack/084-largest-rectangle-in-histogram/)
- [739. Daily Temperatures](../../leetcode-150/stack/739-daily-temperatures/)
- [853. Car Fleet](../../leetcode-150/stack/853-car-fleet/)

**Binary Search:**
- [4. Median of Two Sorted Arrays](../../leetcode-150/binary-search/004-median-of-two-sorted-arrays/)
- [33. Search in Rotated Sorted Array](../../leetcode-150/binary-search/033-search-in-rotated-sorted-array/)
- [74. Search a 2D Matrix](../../leetcode-150/binary-search/074-search-a-2d-matrix/)
- [153. Find Minimum in Rotated Sorted Array](../../leetcode-150/binary-search/153-find-minimum-in-rotated-sorted-array/)
- [704. Binary Search](../../leetcode-150/binary-search/704-binary-search/)
- [875. Koko Eating Bananas](../../leetcode-150/binary-search/875-koko-eating-bananas/)
- [981. Time Based Key-Value Store](../../leetcode-150/binary-search/981-time-based-key-value-store/)

**Linked List:**
- [287. Find the Duplicate Number](../../leetcode-150/linked-list/287-find-the-duplicate-number/), array indexed as implicit linked list

**Heap / Priority Queue:**
- [215. Kth Largest Element in an Array](../../leetcode-150/heap-priority-queue/215-kth-largest-element-in-an-array/)
- [973. K Closest Points to Origin](../../leetcode-150/heap-priority-queue/973-k-closest-points-to-origin/)

**Backtracking:**
- [39. Combination Sum](../../leetcode-150/backtracking/039-combination-sum/)
- [40. Combination Sum II](../../leetcode-150/backtracking/040-combination-sum-ii/)
- [46. Permutations](../../leetcode-150/backtracking/046-permutations/)
- [51. N-Queens](../../leetcode-150/backtracking/051-n-queens/), board as array
- [78. Subsets](../../leetcode-150/backtracking/078-subsets/)
- [79. Word Search](../../leetcode-150/backtracking/079-word-search/), grid DFS + in-place visited
- [90. Subsets II](../../leetcode-150/backtracking/090-subsets-ii/)
- [131. Palindrome Partitioning](../../leetcode-150/backtracking/131-palindrome-partitioning/), 2-D palindrome DP table

**Tries:**
- [212. Word Search II](../../leetcode-150/tries/212-word-search-ii/), grid with in-place visited marker

**Graphs:**
- [130. Surrounded Regions](../../leetcode-150/graphs/130-surrounded-regions/)
- [200. Number of Islands](../../leetcode-150/graphs/200-number-of-islands/)
- [417. Pacific Atlantic Water Flow](../../leetcode-150/graphs/417-pacific-atlantic-water-flow/)
- [695. Max Area of Island](../../leetcode-150/graphs/695-max-area-of-island/)
- [994. Rotting Oranges](../../leetcode-150/graphs/994-rotting-oranges/)

**Advanced Graphs:**
- [778. Swim in Rising Water](../../leetcode-150/advanced-graphs/778-swim-in-rising-water/), grid with modified Dijkstra

**1-D Dynamic Programming:**
- [70. Climbing Stairs](../../leetcode-150/1d-dynamic-programming/070-climbing-stairs/)
- [152. Maximum Product Subarray](../../leetcode-150/1d-dynamic-programming/152-maximum-product-subarray/)
- [198. House Robber](../../leetcode-150/1d-dynamic-programming/198-house-robber/)
- [213. House Robber II](../../leetcode-150/1d-dynamic-programming/213-house-robber-ii/)
- [300. Longest Increasing Subsequence](../../leetcode-150/1d-dynamic-programming/300-longest-increasing-subsequence/)
- [322. Coin Change](../../leetcode-150/1d-dynamic-programming/322-coin-change/)
- [416. Partition Equal Subset Sum](../../leetcode-150/1d-dynamic-programming/416-partition-equal-subset-sum/)
- [746. Min Cost Climbing Stairs](../../leetcode-150/1d-dynamic-programming/746-min-cost-climbing-stairs/)

**2-D Dynamic Programming:**
- [62. Unique Paths](../../leetcode-150/2d-dynamic-programming/062-unique-paths/)
- [309. Best Time to Buy and Sell Stock with Cooldown](../../leetcode-150/2d-dynamic-programming/309-best-time-to-buy-and-sell-stock-with-cooldown/)
- [312. Burst Balloons](../../leetcode-150/2d-dynamic-programming/312-burst-balloons/), interval DP
- [329. Longest Increasing Path in a Matrix](../../leetcode-150/2d-dynamic-programming/329-longest-increasing-path-in-a-matrix/)
- [494. Target Sum](../../leetcode-150/2d-dynamic-programming/494-target-sum/)
- [518. Coin Change II](../../leetcode-150/2d-dynamic-programming/518-coin-change-ii/)

**Greedy:**
- [45. Jump Game II](../../leetcode-150/greedy/045-jump-game-ii/)
- [53. Maximum Subarray](../../leetcode-150/greedy/053-maximum-subarray/)
- [55. Jump Game](../../leetcode-150/greedy/055-jump-game/)
- [134. Gas Station](../../leetcode-150/greedy/134-gas-station/)
- [1899. Merge Triplets to Form Target Triplet](../../leetcode-150/greedy/1899-merge-triplets-to-form-target-triplet/)

**Intervals:**
- [56. Merge Intervals](../../leetcode-150/intervals/056-merge-intervals/)
- [57. Insert Interval](../../leetcode-150/intervals/057-insert-interval/)
- [252. Meeting Rooms](../../leetcode-150/intervals/252-meeting-rooms/)
- [253. Meeting Rooms II](../../leetcode-150/intervals/253-meeting-rooms-ii/)
- [435. Non-overlapping Intervals](../../leetcode-150/intervals/435-non-overlapping-intervals/)
- [1851. Minimum Interval to Include Each Query](../../leetcode-150/intervals/1851-minimum-interval-to-include-each-query/)

**Math & Geometry:**
- [43. Multiply Strings](../../leetcode-150/math-and-geometry/043-multiply-strings/), digit array accumulator
- [48. Rotate Image](../../leetcode-150/math-and-geometry/048-rotate-image/)
- [50. Pow(x, n)](../../leetcode-150/math-and-geometry/050-pow-x-n/)
- [54. Spiral Matrix](../../leetcode-150/math-and-geometry/054-spiral-matrix/)
- [66. Plus One](../../leetcode-150/math-and-geometry/066-plus-one/)
- [73. Set Matrix Zeroes](../../leetcode-150/math-and-geometry/073-set-matrix-zeroes/)

**Bit Manipulation:**
- [136. Single Number](../../leetcode-150/bit-manipulation/136-single-number/)
- [338. Counting Bits](../../leetcode-150/bit-manipulation/338-counting-bits/)

## References

- [Array, Wikipedia](https://en.wikipedia.org/wiki/Array_(data_structure))
- [Dynamic array amortization, CLRS Ch. 17](https://en.wikipedia.org/wiki/Amortized_analysis)
- [Two-pointer technique, LeetCode](https://leetcode.com/tag/two-pointers/)
- [Sliding window pattern, NeetCode](https://neetcode.io/roadmap)
