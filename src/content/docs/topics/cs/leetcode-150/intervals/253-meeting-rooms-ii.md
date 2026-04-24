---
title: "253. Meeting Rooms II"
description: Minimum number of rooms needed to hold all meetings.
parent: intervals
tags: [leetcode, neetcode-150, intervals, heap, sweep-line, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array of meeting time intervals, return the minimum number of conference rooms required.

**Example**
- `intervals = [[0,30],[5,10],[15,20]]` → `2`
- `intervals = [[7,10],[2,4]]` → `1`

LeetCode 253 (premium) · [Link](https://leetcode.com/problems/meeting-rooms-ii/) · *Medium*

## Approach 1: Brute force, simulate time ticks

For every time t from 0 to max_end, count active meetings. Max over all t is the answer.

**Complexity**
- **Time:** O(T · n). Infeasible on big time ranges.
- **Space:** O(1).

## Approach 2: Min-heap of end times (canonical)

Sort intervals by start. Maintain a min-heap of end times for current rooms. For each new meeting: pop end times ≤ current start (those rooms freed up); push the new end time. Answer = max heap size.

```python
import heapq

def min_meeting_rooms(intervals):
    intervals.sort(key=lambda x: x[0])
    heap = []   # end times
    for s, e in intervals:
        if heap and heap[0] <= s:
            heapq.heappop(heap)
        heapq.heappush(heap, e)
    return len(heap)
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(n).

## Approach 3: Sweep line with separate start/end arrays (counters only)

Sort starts and ends independently. Two pointers; increment count on a start, decrement on an end (before a new start). Track max count.

```python
def min_meeting_rooms(intervals):
    starts = sorted(s for s, _ in intervals)
    ends = sorted(e for _, e in intervals)
    i = j = 0
    used = best = 0
    while i < len(intervals):
        if starts[i] < ends[j]:
            used += 1
            best = max(best, used)
            i += 1
        else:
            used -= 1
            j += 1
    return best
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(n).

### Why it works
Intuitively: whenever a meeting's start comes before the earliest current end, we need a new room. Whenever an end arrives first, a room frees up. The running count of active rooms is exactly what we want.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute time tick | O(T · n) | O(1) |
| **Heap of end times** | **O(n log n)** | **O(n)** |
| **Sweep-line counters** | **O(n log n)** | **O(n)** |

Heap version is the canonical answer. Sweep-line is the shortest.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/), end-time min-heap
- [Arrays](../../../data-structures/arrays/), separate start/end sorted arrays
