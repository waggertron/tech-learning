---
title: "146. LRU Cache"
description: Design a Least-Recently-Used cache with O(1) get and put.
parent: linked-list
tags: [leetcode, neetcode-150, linked-lists, hash-tables, design, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Design an LRU cache supporting:

- `get(key)` — return the value if present, else `-1`. Accessing a key marks it most-recently used.
- `put(key, value)` — insert or update. If the cache is full, evict the least-recently used entry.

Both operations must run in **O(1)**.

**Example**
```
LRUCache(capacity=2)
put(1, 1); put(2, 2)
get(1)      // 1
put(3, 3)   // evicts key 2
get(2)      // -1
```

LeetCode 146 · [Link](https://leetcode.com/problems/lru-cache/) · *Medium*

## Approach 1: Brute force — list + dict, O(n) on access

Keep a dict for values and a list for recency order. Every get/put moves the key to the end of the list — O(n) to find and remove.

```python
class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.data = {}
        self.order = []   # least recent first

    def get(self, key: int) -> int:
        if key not in self.data:
            return -1
        self.order.remove(key)
        self.order.append(key)
        return self.data[key]

    def put(self, key: int, value: int) -> None:
        if key in self.data:
            self.order.remove(key)
        elif len(self.data) >= self.cap:
            evict = self.order.pop(0)
            del self.data[evict]
        self.data[key] = value
        self.order.append(key)
```

**Complexity**
- **Get/put:** O(n) due to `list.remove` and `list.pop(0)`.
- **Space:** O(capacity).

Fails the O(1) requirement.

## Approach 2: Python `collections.OrderedDict`

`OrderedDict.move_to_end` is O(1); `popitem(last=False)` evicts the oldest in O(1).

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)
```

**Complexity**
- **Get/put:** **O(1)** amortized.
- **Space:** O(capacity).

Production-correct. The interview follow-up is usually "implement the underlying data structure yourself."

## Approach 3: Hash map + doubly linked list (optimal, language-agnostic)

The canonical LRU implementation. A doubly linked list maintains recency order (head = most recent, tail = least recent). A hash map gives O(1) node lookup by key. Put/get involve finding the node, splicing it out, and re-inserting at the head.

```python
class Node:
    __slots__ = ("key", "val", "prev", "next")
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}   # key -> Node
        # dummy head/tail sentinels
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: Node) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node: Node) -> None:
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add_to_front(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            node = self.cache[key]
            node.val = value
            self._remove(node)
            self._add_to_front(node)
            return
        if len(self.cache) >= self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]
        node = Node(key, value)
        self.cache[key] = node
        self._add_to_front(node)
```

**Complexity**
- **Get/put:** **O(1)** (not amortized — true worst case).
- **Space:** O(capacity).

### Why both data structures are needed
The hash map gives O(1) lookup *by key*; the doubly linked list gives O(1) removal *given a node reference* and ordering. Either alone can't do both — hence the composite.

## Summary

| Approach | get / put | Space | Notes |
| --- | --- | --- | --- |
| List + dict | O(n) | O(cap) | Fails the requirement |
| OrderedDict | **O(1)** amortized | O(cap) | Pythonic; real-world answer |
| **Hash map + doubly linked list** | **O(1)** worst case | O(cap) | Canonical interview answer |

Implement this one from memory. It's the template for LFU cache (460), and for any "fast access + fast removal by reference" pattern.

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/) — doubly linked list for O(1) splicing
- [Hash Tables](../../../data-structures/hash-tables/) — O(1) lookup of nodes by key
