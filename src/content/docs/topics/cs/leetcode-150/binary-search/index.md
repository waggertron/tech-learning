---
title: Binary Search
description: 7 problems that teach binary search in all its forms — on sorted arrays, on rotated arrays, on the answer space, and on partitioned structures.
parent: leetcode-150
tags: [leetcode, neetcode-150, binary-search]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Binary search is deceptively simple: halve the search space using a comparison. The discipline comes from getting the invariants right — open vs. closed intervals, off-by-one at the boundaries, and correct loop termination. Once the basic template is solid, the pattern generalizes in three ways:

- **On sorted data** — the textbook case (Binary Search, Search in 2D Matrix).
- **On rotated / partially-sorted data** — use the fact that one half is always sorted (Find Minimum in Rotated, Search in Rotated).
- **On the answer space** — when the *value* you're solving for is monotonic in feasibility (Koko Eating Bananas, Capacity to Ship, Minimum Days to Make Bouquets).

## Problems

1. [704. Binary Search](./704-binary-search/) — *Easy*
2. [74. Search a 2D Matrix](./074-search-a-2d-matrix/) — *Medium*
3. [875. Koko Eating Bananas](./875-koko-eating-bananas/) — *Medium*
4. [153. Find Minimum in Rotated Sorted Array](./153-find-minimum-in-rotated-sorted-array/) — *Medium*
5. [33. Search in Rotated Sorted Array](./033-search-in-rotated-sorted-array/) — *Medium*
6. [981. Time Based Key-Value Store](./981-time-based-key-value-store/) — *Medium*
7. [4. Median of Two Sorted Arrays](./004-median-of-two-sorted-arrays/) — *Hard*

## Key patterns unlocked here

- **Canonical iterative binary search** — 704.
- **Flattening a matrix to 1D** — 74.
- **Binary search on the answer space** — 875 (template for dozens of variations).
- **Detecting the sorted half** — 153 and 33.
- **Per-key timeline binary search** — 981 (`bisect` on timestamps).
- **Partition search on two arrays** — 4 (the canonical hard binary-search problem).
