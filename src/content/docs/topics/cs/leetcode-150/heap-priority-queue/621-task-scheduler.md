---
title: "621. Task Scheduler"
description: Compute the minimum total time to run a list of CPU tasks given a cooldown constraint between identical tasks.
parent: heap-priority-queue
tags: [leetcode, neetcode-150, heaps, greedy, math, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a list `tasks` (characters A–Z representing task types) and an integer `n` (the cooldown), return the least number of time units the CPU takes to finish. Between any two identical tasks, there must be at least `n` idle cycles.

**Example**
- `tasks = ["A","A","A","B","B","B"]`, `n = 2` → `8` (e.g., `A B idle A B idle A B`)
- `tasks = ["A","A","A","B","B","B"]`, `n = 0` → `6`
- `tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"]`, `n = 2` → `16`

LeetCode 621 · [Link](https://leetcode.com/problems/task-scheduler/) · *Medium*

## Approach 1: Brute force, simulate cycle-by-cycle

Track remaining counts per task and the cooldown expiration for each. At each time step, pick any runnable task.

```python
from collections import Counter

def least_interval(tasks, n):
    counts = Counter(tasks)
    cooldown = {t: 0 for t in counts}
    time = 0
    while any(c > 0 for c in counts.values()):
        picked = None
        best_count = 0
        for t, c in counts.items():
            if c > 0 and cooldown[t] <= time and c > best_count:
                picked = t
                best_count = c
        if picked:
            counts[picked] -= 1
            cooldown[picked] = time + n + 1
        time += 1
    return time
```

**Complexity**
- **Time:** O(T · 26) where T is the answer. Correct but slow on big inputs.
- **Space:** O(26).

Choosing highest-remaining-count is key, otherwise you strand long runs.

## Approach 2: Max-heap + cooldown queue

Max-heap of remaining counts; after running a task, enqueue it with its ready-time into a FIFO. Each cycle: move expired tasks from the queue back into the heap, then run the heap's top.

```python
import heapq
from collections import Counter, deque

def least_interval(tasks, n):
    heap = [-c for c in Counter(tasks).values()]
    heapq.heapify(heap)
    cooldown = deque()   # (ready_time, negated_count_remaining)
    time = 0
    while heap or cooldown:
        time += 1
        if heap:
            c = heapq.heappop(heap) + 1    # heap is negated counts
            if c < 0:
                cooldown.append((time + n, c))
        if cooldown and cooldown[0][0] == time:
            _, c = cooldown.popleft()
            heapq.heappush(heap, c)
    return time
```

**Complexity**
- **Time:** O(T log 26) = O(T).
- **Space:** O(26).

Cleaner than the brute force; a natural fit for "greedy scheduling with recurring cooldowns."

## Approach 3: Closed-form math (optimal)

Let `max_count` be the count of the most-frequent task and `ties` be the number of tasks that hit `max_count`. The answer is:

```
max(len(tasks), (max_count, 1) * (n + 1) + ties)
```

Intuition: build a skeleton of `max_count, 1` "rows" of width `n + 1`, plus a tail row with `ties` slots. Other tasks slot into the idle spaces. If there are more tasks than that schedule provides for, the total time is just `len(tasks)` (no idle needed).

```python
from collections import Counter

def least_interval(tasks, n):
    counts = Counter(tasks)
    max_count = max(counts.values())
    ties = sum(1 for c in counts.values() if c == max_count)
    return max(len(tasks), (max_count, 1) * (n + 1) + ties)
```

**Complexity**
- **Time:** O(T) where T = len(tasks) (to build the Counter).
- **Space:** O(26).

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Simulation | O(T · 26) | O(26) | Direct; slow on large T |
| **Max-heap + cooldown queue** | O(T) | O(26) | Generalizes to heterogeneous cooldowns |
| **Closed-form math** | O(T) | O(26) | Tightest for this specific problem |

The closed-form is elegant and fast; the heap variant is what you reach for when cooldowns vary per task or priorities change dynamically.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/), max-heap + waiting queue for cooldown scheduling
- [Queues](../../../data-structures/queues/), cooldown FIFO
- [Hash Tables](../../../data-structures/hash-tables/), frequency counts
