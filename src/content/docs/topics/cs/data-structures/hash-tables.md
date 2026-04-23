---
title: Hash Tables
description: Key-value storage with average O(1) access — the single highest-leverage data structure for interview problem-solving. Most O(n²) → O(n) improvements pass through a hash table.
parent: data-structures
tags: [data-structures, hash-tables, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

A hash table (also: hash map, dictionary, associative array) stores key-value pairs with average-case O(1) insert, delete, and lookup. It's the single most impactful data structure for interview problem-solving — the difference between a brute-force O(n²) solution and an optimal O(n) one is almost always a hash table.

## In-depth description

A hash function maps keys of arbitrary type to integers in some bucket range. Each bucket points to zero or more entries; **collisions** happen when two keys hash to the same bucket. The two standard collision-handling approaches:

- **Separate chaining** — each bucket holds a linked list (or small array/tree) of entries. Simple, degrades gracefully.
- **Open addressing** — on collision, probe to another bucket (linear, quadratic, or double hashing). Better cache locality; requires tombstones for deletion.

The **load factor** (entries / buckets) determines collision likelihood. Most implementations resize and rehash when the load factor exceeds a threshold (~0.75 for Java HashMap, ~0.5 for open addressing). Resizing is amortized O(1) per insert.

**Worst case is O(n)** — if every key hashes to the same bucket, lookup degrades to linear scan. For adversarial inputs, this is a real DoS risk (hash-flooding); hence randomized hash seeds in modern languages. Java 8 even upgrades chains to balanced trees at a threshold, giving O(log n) worst case.

A **hash set** is a hash table that stores only keys. Use it for "have I seen this?" questions. Critical interview insight: complementary-value lookups (for every `x`, check if `target - x` exists) turn pair-finding problems into linear-time scans.

## Time complexity

| Operation | Average | Worst |
| --- | --- | --- |
| Insert | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Iteration | O(n) | O(n) |
| Space | O(n) | O(n) |

(With Java 8+ treeified buckets: worst case is O(log n) for lookup.)

## Common uses in DSA

1. **O(1) membership / frequency lookup** — Two Sum, Contains Duplicate, First Unique Character, Intersection of Two Arrays.
2. **Complement / pair-finding** — Two Sum variants, 4Sum II (two-sum on pair sums), Pairs of Songs With Total Durations Divisible by 60.
3. **Frequency counting** — Top K Frequent Elements (with a heap), Valid Anagram, Ransom Note, Majority Element.
4. **Prefix sum with hash** — Subarray Sum Equals K, Continuous Subarray Sum, Contiguous Array (count of 0s = 1s).
5. **Deduplication and grouping** — Group Anagrams (key by sorted string or char-count tuple), Longest Consecutive Sequence, Longest Substring Without Repeating Characters.

**Canonical LeetCode problems:** #1 Two Sum, #49 Group Anagrams, #128 Longest Consecutive Sequence, #146 LRU Cache, #217 Contains Duplicate, #347 Top K Frequent Elements, #560 Subarray Sum Equals K.

## Python example

```python
from collections import defaultdict, Counter

# Basic dict
d = {"a": 1, "b": 2}
d["a"]          # 1
d.get("c", 0)   # 0 (default for missing key)
"a" in d        # True — O(1) membership

# defaultdict for group-by / accumulation
groups = defaultdict(list)
for word in ["eat", "tea", "tan", "ate", "nat", "bat"]:
    key = "".join(sorted(word))
    groups[key].append(word)

# Counter for frequency counting
c = Counter("mississippi")
c.most_common(2)   # [('i', 4), ('s', 4)]

# Two Sum: complement lookup in one pass — O(n)
def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return [-1, -1]

# Subarray Sum Equals K (prefix sum + hash) — O(n)
def subarray_sum(nums, k):
    count, total = 0, 0
    prefix_counts = {0: 1}   # empty prefix has sum 0 once
    for x in nums:
        total += x
        count += prefix_counts.get(total - k, 0)
        prefix_counts[total] = prefix_counts.get(total, 0) + 1
    return count

# Longest Consecutive Sequence — O(n) via set lookups
def longest_consecutive(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 in s:          # only start from run-start candidates
            continue
        cur = x
        length = 1
        while cur + 1 in s:
            cur += 1
            length += 1
        best = max(best, length)
    return best
```

## LeetCode problems

**NeetCode 150 — Arrays &amp; Hashing:**
- [217. Contains Duplicate](../../leetcode-150/arrays-and-hashing/217-contains-duplicate/)
- [242. Valid Anagram](../../leetcode-150/arrays-and-hashing/242-valid-anagram/)
- [1. Two Sum](../../leetcode-150/arrays-and-hashing/001-two-sum/)
- [49. Group Anagrams](../../leetcode-150/arrays-and-hashing/049-group-anagrams/)
- [347. Top K Frequent Elements](../../leetcode-150/arrays-and-hashing/347-top-k-frequent-elements/)
- [36. Valid Sudoku](../../leetcode-150/arrays-and-hashing/036-valid-sudoku/)
- [128. Longest Consecutive Sequence](../../leetcode-150/arrays-and-hashing/128-longest-consecutive-sequence/)

*More categories coming soon — Sliding Window (all the subarray-sum / character-frequency problems), Stack (#146 LRU Cache), Graph (Clone Graph), etc.*

## References

- [Hash table — Wikipedia](https://en.wikipedia.org/wiki/Hash_table)
- [Java HashMap internals (Java 8+ tree buckets)](https://dev.java/learn/api/collections-framework/implementations/hashmap/)
- [Python dict implementation notes](https://github.com/python/cpython/blob/main/Objects/dictobject.c)
- [Hash flooding DoS — crosby & wallach 2003](https://www.usenix.org/legacy/events/sec03/tech/full_papers/crosby/crosby.pdf)
