---
title: "347. Top K Frequent Elements"
description: Return the k most frequent elements in an array.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, arrays, hash-tables, heaps, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order. The problem guarantees the answer is unique.

**Example**
- `nums = [1,1,1,2,2,3]`, `k = 2` → `[1, 2]`
- `nums = [1]`, `k = 1` → `[1]`

Follow-up: can you do better than O(n log n)?

LeetCode 347 · [Link](https://leetcode.com/problems/top-k-frequent-elements/) · *Medium*

## Approach 1: Brute force, count, then sort

Count frequencies with a hash map, then sort by count descending, take the first `k`.

```python
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    return [num for num, _ in counts.most_common(k)]

# Or explicitly:
# sorted_items = sorted(counts.items(), key=lambda x: -x[1])
# return [num for num, _ in sorted_items[:k]]
```

**Complexity**
- **Time:** O(n log n). Sorting all distinct elements.
- **Space:** O(n) for the counter.

`most_common(k)` internally uses a heap (O(n log k)), but for "brute" purposes treat it as a full sort.

## Approach 2: Size-k min-heap

Maintain a heap of size `k` over `(count, value)` pairs. Evict the smallest whenever the heap grows past `k`.

```python
from collections import Counter
import heapq

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    heap = []
    for num, cnt in counts.items():
        heapq.heappush(heap, (cnt, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [num for _, num in heap]
```

**Complexity**
- **Time:** O(n log k). Each of up to `n` distinct elements pushed/popped on a size-`k` heap.
- **Space:** O(n + k). Counter + heap.

When `k` is small relative to `n`, this is noticeably faster than the O(n log n) sort.

## Approach 3: Bucket sort by frequency (optimal)

Frequencies are bounded by `n` (no value can appear more than `n` times). Bucket each distinct element into `buckets[freq]`, then scan from high to low.

```python
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, cnt in counts.items():
        buckets[cnt].append(num)

    result = []
    for cnt in range(len(buckets), 1, 0, -1):
        for num in buckets[cnt]:
            result.append(num)
            if len(result) == k:
                return result
    return result
```

**Complexity**
- **Time:** O(n). Counter is O(n); bucketing is O(n); the scan visits at most `n` elements.
- **Space:** O(n) for counter and buckets.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Sort by count | O(n log n) | O(n) |
| Size-k min-heap | O(n log k) | O(n + k) |
| **Bucket sort** | **O(n)** | O(n) |

Bucket sort beats the heap when `k` is not trivially small; the heap wins on streaming input or when you need online updates. Choose based on the scenario.

## Related data structures

- [Arrays](../../../data-structures/arrays/), input and bucket representation
- [Hash Tables](../../../data-structures/hash-tables/), frequency counting (Counter)
- [Heaps / Priority Queues](../../../data-structures/heaps/), size-k min-heap pattern
