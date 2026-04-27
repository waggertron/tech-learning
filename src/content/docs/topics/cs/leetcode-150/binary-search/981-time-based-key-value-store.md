---
title: "981. Time Based Key-Value Store (Medium)"
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
        self.data = defaultdict(list)          # L1: O(1) init

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.data[key].append((timestamp, value))  # L2: O(1) amortized append

    def get(self, key: str, timestamp: int) -> str:
        best = ""
        for ts, v in self.data[key]:           # L3: scan all entries for key, O(n)
            if ts <= timestamp:                # L4: O(1) compare
                best = v
            else:
                break                          # L5: early exit (timestamps sorted)
        return best
```

**Where the time goes, line by line**

*Variables: n = number of set() calls for the queried key.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (set append) | O(1) amortized | 1 per set call | O(1) per set |
| **L3/L4 (get scan)** | **O(1)** | **up to n** | **O(n) per get** ← dominates |

`set` is O(1); `get` scans entries until it finds a timestamp exceeding the query. With strictly increasing timestamps, the early break at L5 helps in the average case but not the worst case.

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
        self.data[key].append((timestamp, value))   # L1: O(1) amortized

    def get(self, key: str, timestamp: int) -> str:
        entries = self.data[key]
        lo, hi = 0, len(entries) - 1                # L2: O(1)
        result = ""
        while lo <= hi:                              # L3: binary search, O(log n) steps
            mid = (lo + hi) // 2                    # L4: O(1) midpoint
            if entries[mid][0] <= timestamp:         # L5: O(1) compare timestamp
                result = entries[mid][1]             # L6: O(1) record candidate
                lo = mid + 1                         # L7: O(1) look for larger ts
            else:
                hi = mid - 1                        # L8: O(1) too late, go earlier
        return result
```

**Where the time goes, line by line**

*Variables: n = number of set() calls for the queried key.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (set append) | O(1) amortized | 1 per set | O(1) per set |
| L2 (init bounds) | O(1) | 1 per get | O(1) |
| **L3-L8 (binary search loop)** | **O(1)** | **log n** | **O(log n) per get** ← dominates |

Since timestamps for each key are strictly increasing (guaranteed by the problem), the per-key list is sorted, enabling binary search. We track `result` as we go right, keeping the last valid timestamp found.

**Complexity**
- `set`: O(1).
- `get`: **O(log n)**, driven by L3 (binary search over n sorted entries).
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
        self.timestamps[key].append(timestamp)   # L1: O(1) amortized
        self.values[key].append(value)           # L2: O(1) amortized

    def get(self, key: str, timestamp: int) -> str:
        ts = self.timestamps[key]
        i = bisect_right(ts, timestamp) - 1      # L3: O(log n) binary search
        if i < 0:                                # L4: O(1)
            return ""
        return self.values[key][i]               # L5: O(1) index lookup
```

**Where the time goes, line by line**

*Variables: n = number of set() calls for the queried key.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1/L2 (set appends) | O(1) amortized | 1 per set | O(1) per set |
| **L3 (bisect_right)** | **O(log n)** | **1 per get** | **O(log n) per get** ← dominates |
| L4/L5 (bounds check + index) | O(1) | 1 per get | O(1) |

`bisect_right(ts, timestamp)` returns the insertion point for `timestamp` in the sorted `ts` list. Subtracting 1 gives the rightmost entry with timestamp ≤ the query. If `i < 0`, no entry exists for that key at or before the query.

**Complexity**
- `set`: O(1) amortized, driven by L1/L2 (list appends).
- `get`: **O(log n)**, driven by L3 (bisect_right over n sorted timestamps).
- Space: O(n).

`bisect_right(ts, timestamp) - 1` returns the largest index whose timestamp is ≤ `timestamp`.

## Summary

| Approach | `set` | `get` | Space |
| --- | --- | --- | --- |
| Linear scan | O(1) | O(n) | O(n) |
| Manual binary search | O(1) | O(log n) | O(n) |
| **`bisect_right`** | **O(1)** | **O(log n)** | O(n) |

The `bisect` version is idiomatic Python; the manual binary search is what you'd write in languages without a `bisect`-equivalent (Java: `Collections.binarySearch`; C++: `upper_bound`).

## Test cases

```python
# Quick smoke tests - paste into a REPL or save as test_981.py and run.
# Uses the optimal Approach 3 implementation.

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
        i = bisect_right(ts, timestamp) - 1
        if i < 0:
            return ""
        return self.values[key][i]

def _run_tests():
    store = TimeMap()
    store.set("foo", "bar", 1)
    assert store.get("foo", 1) == "bar"
    assert store.get("foo", 3) == "bar"     # no entry at 3, returns closest before
    store.set("foo", "bar2", 4)
    assert store.get("foo", 4) == "bar2"
    assert store.get("foo", 5) == "bar2"
    assert store.get("foo", 0) == ""        # before any entry
    assert store.get("missing", 1) == ""    # key never set
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), per-key sorted timestamp list
- [Hash Tables](../../../data-structures/hash-tables/), outer key → list mapping
