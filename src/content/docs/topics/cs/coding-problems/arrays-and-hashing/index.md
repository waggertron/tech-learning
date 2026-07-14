---
title: Arrays & Hashing
description: "18 problems covering hash maps, frequency counting, prefix sums, range boundaries, and the complement-lookup pattern that appears throughout every other category."
parent: coding-problems
tags: [leetcode, neetcode-150, arrays, hash-tables]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Overview

Arrays & Hashing is the first section of the NeetCode 150 and the most load-bearing: a hash map + array reasoning pattern appears in most of the remaining categories. Master these nine and you've unlocked roughly 30% of the full list's problem-solving surface.

## Problems

1. [217. Contains Duplicate (Easy)](./217-contains-duplicate/)
2. [242. Valid Anagram (Easy)](./242-valid-anagram/)
3. [1. Two Sum (Easy)](./001-two-sum/)
4. [49. Group Anagrams (Medium)](./049-group-anagrams/)
5. [347. Top K Frequent Elements (Medium)](./347-top-k-frequent-elements/)
6. [238. Product of Array Except Self (Medium)](./238-product-of-array-except-self/)
7. [36. Valid Sudoku (Medium)](./036-valid-sudoku/)
8. [271. Encode and Decode Strings (Medium)](./271-encode-and-decode-strings/) (LC premium, also appears as #659)
9. [128. Longest Consecutive Sequence (Medium)](./128-longest-consecutive-sequence/)

**Bonus problems (same pattern, outside NeetCode 150):**

- [205. Isomorphic Strings (Easy)](./205-isomorphic-strings/)
- [228. Summary Ranges (Easy)](./228-summary-ranges/)
- [303. Range Sum Query - Immutable (Easy)](./303-range-sum-query-immutable/)
- [349. Intersection of Two Arrays (Easy)](./349-intersection-of-two-arrays/)
- [387. First Unique Character in a String (Easy)](./387-first-unique-character/)
- [454. 4Sum II (Medium)](./454-4sum-ii/)
- [459. Repeated Substring Pattern (Easy)](./459-repeated-substring-pattern/)
- [1010. Pairs of Songs With Total Durations Divisible by 60 (Medium)](./1010-pairs-of-songs-divisible-by-60/)
- [1071. Greatest Common Divisor of Strings (Easy)](./1071-greatest-common-divisor-of-strings/)

## Key patterns unlocked here

- **Hash set for dedup / membership**: Contains Duplicate, Longest Consecutive Sequence.
- **Frequency counting**: Valid Anagram, Group Anagrams, Top K Frequent Elements.
- **Complement lookup (one-pass hash)**: Two Sum, and dozens of variants downstream.
- **Prefix / suffix products or sums**: Product of Array Except Self.
- **Encoding state into a hashable key**: Group Anagrams (char-count tuple), Valid Sudoku (row/col/box keys).
- **Prefix sums for $O(1)$ range queries**: Range Sum Query.
- **Range boundaries in a sorted scan**: Summary Ranges.
- **Modular arithmetic for pair counting**: Pairs of Songs Divisible by 60.
