---
title: Arrays & Hashing
description: 9 foundational problems covering arrays, hash maps, and the patterns that show up across the entire NeetCode 150.
parent: leetcode-150
tags: [leetcode, neetcode-150, arrays, hash-tables]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Arrays & Hashing is the first section of the NeetCode 150 and the most load-bearing, a hash map + array reasoning pattern appears in most of the remaining categories. Master these nine and you've unlocked roughly 30% of the full list's problem-solving surface.

## Problems

1. [217. Contains Duplicate](./217-contains-duplicate/), *Easy*
2. [242. Valid Anagram](./242-valid-anagram/), *Easy*
3. [1. Two Sum](./001-two-sum/), *Easy*
4. [49. Group Anagrams](./049-group-anagrams/), *Medium*
5. [347. Top K Frequent Elements](./347-top-k-frequent-elements/), *Medium*
6. [238. Product of Array Except Self](./238-product-of-array-except-self/), *Medium*
7. [36. Valid Sudoku](./036-valid-sudoku/), *Medium*
8. [271. Encode and Decode Strings](./271-encode-and-decode-strings/), *Medium* (LC premium, also appears as #659)
9. [128. Longest Consecutive Sequence](./128-longest-consecutive-sequence/), *Medium*

## Key patterns unlocked here

- **Hash set for dedup / membership**, Contains Duplicate, Longest Consecutive Sequence.
- **Frequency counting**, Valid Anagram, Group Anagrams, Top K Frequent Elements.
- **Complement lookup (one-pass hash)**, Two Sum, and dozens of variants downstream.
- **Prefix / suffix products or sums**, Product of Array Except Self.
- **Encoding state into a hashable key**, Group Anagrams (char-count tuple), Valid Sudoku (row/col/box keys).
