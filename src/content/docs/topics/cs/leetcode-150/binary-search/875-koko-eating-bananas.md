---
title: "875. Koko Eating Bananas"
description: Find the minimum eating speed k such that Koko can finish all banana piles within h hours.
parent: binary-search
tags: [leetcode, neetcode-150, binary-search, arrays, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Koko has `n` piles of bananas (array `piles`, where `piles[i]` is the count in pile `i`). Each hour she chooses one pile and eats up to `k` bananas from it. If the pile has fewer than `k`, she finishes the pile but doesn't eat more bananas that hour.

Return the minimum integer `k` such that she can eat all bananas within `h` hours.

**Example**
- `piles = [3,6,7,11]`, `h = 8` → `4`
- `piles = [30,11,23,4,20]`, `h = 5` → `30`
- `piles = [30,11,23,4,20]`, `h = 6` → `23`

LeetCode 875 · [Link](https://leetcode.com/problems/koko-eating-bananas/) · *Medium*

## Approach 1: Brute force — try every speed from 1 upward

Start at `k = 1` and increment until she finishes in time.

```python
from math import ceil

def min_eating_speed(piles: list[int], h: int) -> int:
    k = 1
    while True:
        hours = sum(ceil(p / k) for p in piles)
        if hours <= h:
            return k
        k += 1
```

**Complexity**
- **Time:** O(n · max(piles)) worst case.
- **Space:** O(1).

## Approach 2: Linear search from max downward (no improvement)

Starting from `k = max(piles)` and decrementing doesn't help — we'd still do O(max) iterations.

A genuine middle tier is the **realization that feasibility is monotonic**: if speed `k` works, every `k' > k` also works. That monotonicity is the signal for binary search.

## Approach 3: Binary search on the answer (optimal)

The answer lives in `[1, max(piles)]`. Binary-search this range using a feasibility predicate `hours_needed(k) <= h`.

```python
from math import ceil

def min_eating_speed(piles: list[int], h: int) -> int:
    def hours(k: int) -> int:
        return sum(ceil(p / k) for p in piles)

    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours(mid) <= h:
            hi = mid        # mid works; look smaller
        else:
            lo = mid + 1    # too slow; need larger k
    return lo
```

**Complexity**
- **Time:** O(n · log(max(piles))). Each feasibility check is O(n); we do log(max) of them.
- **Space:** O(1).

### Integer-only hours (avoid float `ceil`)
`ceil(p / k)` can be replaced with `(p + k - 1) // k` to avoid floating point entirely:

```python
def hours(k: int) -> int:
    return sum((p + k - 1) // k for p in piles)
```

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Linear scan on k | O(n · max(piles)) | O(1) |
| **Binary search on k** | **O(n · log(max(piles)))** | **O(1)** |

This is the template for every "minimum/maximum value that satisfies a monotonic predicate" problem. Once you recognize the monotonicity, you have the algorithm.

Adjacent problems: 1011 Capacity To Ship Packages, 410 Split Array Largest Sum, 1482 Minimum Days to Make Bouquets, 2226 Maximum Candies Allocated to K Children.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — the piles array; feasibility predicate
