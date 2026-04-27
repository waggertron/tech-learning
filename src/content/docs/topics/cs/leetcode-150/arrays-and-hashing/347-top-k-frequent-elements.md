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
    counts = Counter(nums)                          # L1: O(n) build counter
    return [num for num, _ in counts.most_common(k)]  # L2: O(n log k) heap internally
```

**Where the time goes, line by line**

*Variables: n = len(nums), k = number of top elements requested.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (Counter)** | **O(n)** | **1** | **O(n)** |
| **L2 (most_common)** | **O(n log k)** | **1** | **O(n log k)** ← dominates |

`most_common(k)` uses a heap internally (O(n log k)), not a full sort.

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
    counts = Counter(nums)                 # L1: O(n) build counter
    heap = []                              # L2: O(1)
    for num, cnt in counts.items():        # L3: loop over d distinct elements
        heapq.heappush(heap, (cnt, num))   # L4: O(log k) per push
        if len(heap) > k:                  # L5: O(1) check
            heapq.heappop(heap)            # L6: O(log k) pop
    return [num for _, num in heap]        # L7: O(k)
```

**Where the time goes, line by line**

*Variables: n = len(nums), k = number of top elements requested, d = number of distinct elements (d ≤ n).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (Counter) | O(n) | 1 | O(n) |
| L3 (loop) | O(1) | d | O(d) |
| **L4 (heappush)** | **O(log k)** | **d** | **O(d log k)** ← dominates |
| L6 (heappop) | O(log k) | at most d-k | O(d log k) |
| L7 (extract) | O(k) | 1 | O(k) |

Since d ≤ n, the total is O(n log k).

**Complexity**
- **Time:** O(n log k), driven by L4/L6 (heap push/pop on a size-k heap). Each of up to `n` distinct elements pushed/popped on a size-`k` heap.
- **Space:** O(n + k). Counter + heap.

When `k` is small relative to `n`, this is noticeably faster than the O(n log n) sort.

## Approach 3: Bucket sort by frequency (optimal)

Frequencies are bounded by `n` (no value can appear more than `n` times). Bucket each distinct element into `buckets[freq]`, then scan from high to low.

```python
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)                         # L1: O(n) build counter
    buckets = [[] for _ in range(len(nums) + 1)]   # L2: O(n) n+1 buckets
    for num, cnt in counts.items():                # L3: loop d distinct elements
        buckets[cnt].append(num)                   # L4: O(1) append

    result = []
    for cnt in range(len(buckets) - 1, 0, -1):    # L5: scan buckets high-to-low
        for num in buckets[cnt]:                   # L6: visit elements in bucket
            result.append(num)                     # L7: O(1) append
            if len(result) == k:                   # L8: O(1) check
                return result                      # L9: O(1) early return
    return result
```

**Where the time goes, line by line**

*Variables: n = len(nums), k = number of top elements requested.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (Counter) | O(n) | 1 | O(n) |
| L2 (init buckets) | O(n) | 1 | O(n) |
| **L3, L4 (bucketing)** | **O(1)** | **d ≤ n** | **O(n)** |
| **L5-L9 (scan + collect)** | **O(1) per element** | **at most n** | **O(n)** ← dominates total |

Every distinct element is bucketed once and visited at most once during the scan. The bucket array has n+1 slots, all accessed in O(1).

**Complexity**
- **Time:** O(n), driven by L1/L2 (linear setup) plus the O(n) total scan in L5-L9. Counter is O(n); bucketing is O(n); the scan visits at most `n` elements.
- **Space:** O(n) for counter and buckets.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Sort by count | O(n log n) | O(n) |
| Size-k min-heap | O(n log k) | O(n + k) |
| **Bucket sort** | **O(n)** | O(n) |

Bucket sort beats the heap when `k` is not trivially small; the heap wins on streaming input or when you need online updates. Choose based on the scenario.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_top_k_frequent.py and run.
# Uses the canonical implementation (Approach 3: bucket sort).

from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, cnt in counts.items():
        buckets[cnt].append(num)
    result = []
    for cnt in range(len(buckets) - 1, 0, -1):
        for num in buckets[cnt]:
            result.append(num)
            if len(result) == k:
                return result
    return result

def _run_tests():
    assert sorted(top_k_frequent([1,1,1,2,2,3], 2)) == [1, 2]
    assert top_k_frequent([1], 1) == [1]
    assert sorted(top_k_frequent([1,2], 2)) == [1, 2]
    # All same frequency, k=1: any one element is valid
    r = top_k_frequent([1,2,3], 1)
    assert len(r) == 1 and r[0] in [1, 2, 3]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), input and bucket representation
- [Hash Tables](../../../data-structures/hash-tables/), frequency counting (Counter)
- [Heaps / Priority Queues](../../../data-structures/heaps/), size-k min-heap pattern
