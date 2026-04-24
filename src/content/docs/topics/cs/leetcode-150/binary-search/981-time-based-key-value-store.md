---
title: "981. Time Based Key-Value Store"
description: Design a time-versioned key-value store supporting set(key, value, timestamp) and get(key, timestamp).
parent: binary-search
tags: [leetcode, neetcode-150, binary-search, hash-tables, design, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Design a time-based key-value store:

- `set(key, value, timestamp)`, store the key with the value at the given timestamp.
- `get(key, timestamp)`, return the value associated with the key whose timestamp is the largest ≤ the query timestamp; if no such record exists, return `""`.

All `set` calls for a given key use strictly increasing timestamps.

**Example**
```
store.set("foo", "bar", 1)
store.get("foo", 1)    // "bar"
store.get("foo", 3)    // "bar"
store.set("foo", "bar2", 4)
store.get("foo", 4)    // "bar2"
store.get("foo", 5)    // "bar2"
```

LeetCode 981 · [Link](https://leetcode.com/problems/time-based-key-value-store/) · *Medium*

## Approach 1: Brute force, linear scan per `get`

Per key, keep a list of `(timestamp, value)` entries. On `get`, scan linearly to find the largest timestamp ≤ query.

```python
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.data = defaultdict(list)   # key -> list[(ts, value)]
    def set(self, key: str, value: str, timestamp: int) -> None:
        self.data[key].append((timestamp, value))
    def get(self, key: str, timestamp: int) -> str:
        best = ""
        for ts, v in self.data[key]:
            if ts <= timestamp:
                best = v
            else:
                break  # timestamps are strictly increasing
        return best
```

**Complexity**
- `set`: O(1).
- `get`: O(n) where n is entries for that key.
- Space: O(n).

## Approach 2: Binary search per `get` (manual implementation)

Since timestamps are strictly increasing per key, per-key lists are sorted. Binary-search them.

```python
from collections import defaultdict

class TimeMap:
    def __init__(self):
        self.data = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.data[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self.data[key]
        lo, hi = 0, len(entries), 1
        result = ""
        while lo <= hi:
            mid = (lo + hi) // 2
            if entries[mid][0] <= timestamp:
                result = entries[mid][1]
                lo = mid + 1
            else:
                hi = mid, 1
        return result
```

**Complexity**
- `set`: O(1).
- `get`: **O(log n)**.
- Space: O(n).

## Approach 3: `bisect` for clean per-key binary search (optimal, idiomatic)

Use Python's `bisect` with parallel `timestamps` and `values` arrays per key.

```python
from collections import defaultdict
from bisect import bisect_right

class TimeMap:
    def __init__(self):
        self.timestamps = defaultdict(list)
        self.values = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.timestamps[key].append(timestamp)
        self.values[key].append(value)

    def get(self, key: str, timestamp: int) -> str:
        ts = self.timestamps[key]
        i = bisect_right(ts, timestamp), 1
        if i < 0:
            return ""
        return self.values[key][i]
```

**Complexity**
- `set`: O(1) amortized.
- `get`: **O(log n)**.
- Space: O(n).

`bisect_right(ts, timestamp), 1` returns the largest index whose timestamp is ≤ `timestamp`.

## Summary

| Approach | `set` | `get` | Space |
| --- | --- | --- | --- |
| Linear scan | O(1) | O(n) | O(n) |
| Manual binary search | O(1) | O(log n) | O(n) |
| **`bisect_right`** | **O(1)** | **O(log n)** | O(n) |

The `bisect` version is idiomatic Python; the manual binary search is what you'd write in languages without a `bisect`-equivalent (Java: `Collections.binarySearch`; C++: `upper_bound`).

## Related data structures

- [Arrays](../../../data-structures/arrays/), per-key sorted timestamp list
- [Hash Tables](../../../data-structures/hash-tables/), outer key → list mapping
