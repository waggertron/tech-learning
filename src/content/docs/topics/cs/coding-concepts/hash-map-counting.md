---
title: Hash Map Counting
description: "Frequency-table tactics for turning membership, complement, and multiplicity questions into direct lookups."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Hash map counting stores what has already appeared, how often it appeared, or where it appeared. The lookup turns a future question into a direct membership or frequency check.

The invariant is that the map represents the processed portion of the input. For complements, it answers whether the missing value has been seen. For anagrams, it represents the remaining or current character counts. For grouping, it maps a canonical key to matching items.

The design choice is the key. Sometimes the raw value is enough. Sometimes the key is a tuple, a remainder, a sorted string, or a frequency vector. Most mistakes come from choosing a key that loses information or keeps too much irrelevant information.

## Value

The value is trading memory for direct access. Many quadratic comparisons become one pass because earlier values are indexed by the question the current value needs to ask.

### Direct complexity example

- **Brute force:** Compare every pair or every string against every other string: $O(n^2)$ time, or worse when each comparison scans characters.
- **With this tactic:** Store counts or canonical keys in a map: $O(n)$ expected time for simple keys, often $O(nk)$ when each key costs `k` to build.
- **Space:** The space is $O(u)$ for `u` distinct keys, plus any grouped output that the problem requires.

## Challenges this solves

- two-sum complements
- frequency equality
- grouping anagrams
- subarray count by remainder or prefix
- first unique or duplicate detection

## When to use it

Use this tactic when these conditions are true:

- the question asks whether a matching value has appeared
- multiplicity matters
- a complement or remainder defines the missing partner
- sorting would work but a linear expected-time lookup is available

## When not to use it

Reach for a different tactic when these warning signs appear:

- the key would be as large as the whole remaining problem state
- order relationships are more important than membership
- hash collisions or memory limits dominate
- the input domain is tiny enough for an array counter to be simpler

## Terminology clues

These prompt words often point toward this concept:

- frequency
- count
- seen before
- duplicate
- anagram
- complement
- remainder
- group by

## Problems that use it

- [1. Two Sum](../coding-problems/arrays-and-hashing/001-two-sum/)
- [3. Longest Substring Without Repeating Characters](../coding-problems/sliding-window/003-longest-substring-without-repeating-characters/)
- [36. Valid Sudoku](../coding-problems/arrays-and-hashing/036-valid-sudoku/)
- [49. Group Anagrams](../coding-problems/arrays-and-hashing/049-group-anagrams/)
- [128. Longest Consecutive Sequence](../coding-problems/arrays-and-hashing/128-longest-consecutive-sequence/)
- [138. Copy List with Random Pointer](../coding-problems/linked-list/138-copy-list-with-random-pointer/)
- [146. LRU Cache](../coding-problems/linked-list/146-lru-cache/)
- [217. Contains Duplicate](../coding-problems/arrays-and-hashing/217-contains-duplicate/)
- [242. Valid Anagram](../coding-problems/arrays-and-hashing/242-valid-anagram/)
- [347. Top K Frequent Elements](../coding-problems/arrays-and-hashing/347-top-k-frequent-elements/)
- [349. Intersection of Two Arrays](../coding-problems/arrays-and-hashing/349-intersection-of-two-arrays/)
- [387. First Unique Character in a String](../coding-problems/arrays-and-hashing/387-first-unique-character/)
- [454. 4Sum II](../coding-problems/arrays-and-hashing/454-4sum-ii/)
- [496. Next Greater Element I](../coding-problems/stack/496-next-greater-element-i/)
- [560. Subarray Sum Equals K](../coding-problems/sliding-window/560-subarray-sum-equals-k/)
- [567. Permutation in String](../coding-problems/sliding-window/567-permutation-in-string/)
- [763. Partition Labels](../coding-problems/greedy/763-partition-labels/)
- [1010. Pairs of Songs With Total Durations Divisible by 60](../coding-problems/arrays-and-hashing/1010-pairs-of-songs-divisible-by-60/)
- [2013. Detect Squares](../coding-problems/math-and-geometry/2013-detect-squares/)

## Related concepts

- [Prefix sums](./prefix-sums/)
- [Top K](./top-k/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
