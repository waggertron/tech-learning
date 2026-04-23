---
title: "355. Design Twitter"
description: Design a simplified Twitter feed where each user's recent 10 tweets across followed users are merged in order.
parent: heap-priority-queue
tags: [leetcode, neetcode-150, heaps, hash-tables, design, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Design a simplified Twitter where each user can post tweets, follow/unfollow users, and view the 10 most recent tweets in their news feed (including from themselves and followed users).

Required methods:

- `postTweet(userId, tweetId)`
- `follow(followerId, followeeId)`
- `unfollow(followerId, followeeId)`
- `getNewsFeed(userId)` — return the 10 most-recent tweet IDs from the user and those they follow, most recent first.

LeetCode 355 · [Link](https://leetcode.com/problems/design-twitter/) · *Medium*

## Approach 1: Brute force — merge all tweets and sort

Per-user tweet list; on `getNewsFeed`, concatenate relevant lists and sort by timestamp.

```python
from collections import defaultdict

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = defaultdict(list)   # user -> list[(time, tweetId)]
        self.follows = defaultdict(set)   # follower -> set(followees)

    def postTweet(self, userId, tweetId):
        self.tweets[userId].append((self.time, tweetId))
        self.time += 1

    def follow(self, followerId, followeeId):
        self.follows[followerId].add(followeeId)

    def unfollow(self, followerId, followeeId):
        self.follows[followerId].discard(followeeId)

    def getNewsFeed(self, userId):
        users = self.follows[userId] | {userId}
        feed = []
        for u in users:
            feed.extend(self.tweets[u])
        feed.sort(reverse=True)
        return [t for _, t in feed[:10]]
```

**Complexity**
- `getNewsFeed`: O(T log T) where T is total tweets across followed users.
- Others: O(1).

## Approach 2: Per-user sorted list + k-way merge with a heap (optimal)

Store each user's tweets as a list (append-only, so it's naturally sorted by time). On `getNewsFeed`, k-way-merge the latest 10 from each followed user using a max-heap of size ≤ (followees + 1).

```python
from collections import defaultdict
import heapq

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = defaultdict(list)   # user -> list[(time, tweetId)]
        self.follows = defaultdict(set)

    def postTweet(self, userId, tweetId):
        self.tweets[userId].append((self.time, tweetId))
        self.time += 1

    def follow(self, followerId, followeeId):
        self.follows[followerId].add(followeeId)

    def unfollow(self, followerId, followeeId):
        self.follows[followerId].discard(followeeId)

    def getNewsFeed(self, userId):
        users = self.follows[userId] | {userId}
        heap = []
        # Seed the heap with the latest tweet from each user
        for u in users:
            if self.tweets[u]:
                i = len(self.tweets[u]) - 1
                t, tid = self.tweets[u][i]
                heap.append((-t, u, i, tid))
        heapq.heapify(heap)

        feed = []
        while heap and len(feed) < 10:
            neg_t, u, i, tid = heapq.heappop(heap)
            feed.append(tid)
            if i > 0:
                i -= 1
                t2, tid2 = self.tweets[u][i]
                heapq.heappush(heap, (-t2, u, i, tid2))
        return feed
```

**Complexity**
- `getNewsFeed`: O(10 · log k) where k = number of followed users.
- Others: O(1) amortized.

Same pattern as problem 23 (Merge k Sorted Lists).

## Approach 3: Cap per-user feed; global merge

If each user only ever needs the last 10 tweets, truncate the per-user list to length 10 (a rolling window). Then merge at most `10 · k` tweets on `getNewsFeed`.

```python
# Identical to Approach 2 but truncate self.tweets[userId] to length 10 on postTweet.
```

**Complexity**
- `getNewsFeed`: O(10 · k).
- Others: O(1).

Lower memory if you don't need long-term history.

## Summary

| Approach | getNewsFeed | postTweet | Notes |
| --- | --- | --- | --- |
| Collect all + sort | O(T log T) | O(1) | Simplest |
| **Heap k-way merge** | **O(10 log k)** | O(1) | Canonical answer |
| Rolling per-user window | O(10 · k) | O(1) | If history truncation is OK |

The k-way merge pattern is the right generalization: it's the same code you'd use to implement Kafka partition consumers, merged log readers, or any "top-N across ordered streams" system.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/) — k-way merge on per-user feeds
- [Hash Tables](../../../data-structures/hash-tables/) — user → tweets, follower → followees
- [Linked Lists](../../../data-structures/linked-lists/) — could replace the per-user list if you need O(1) prepend
