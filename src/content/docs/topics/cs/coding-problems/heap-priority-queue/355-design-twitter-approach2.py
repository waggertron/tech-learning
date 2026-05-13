from collections import defaultdict
import heapq

class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets = defaultdict(list)   # user -> list[(time, tweetId)]
        self.follows = defaultdict(set)

    def postTweet(self, userId, tweetId):
        self.tweets[userId].append((self.time, tweetId))   # L1: O(1)
        self.time += 1

    def follow(self, followerId, followeeId):
        self.follows[followerId].add(followeeId)            # L2: O(1)

    def unfollow(self, followerId, followeeId):
        self.follows[followerId].discard(followeeId)        # L3: O(1)

    def getNewsFeed(self, userId):
        users = self.follows[userId] | {userId}
        heap = []
        # Seed the heap with the latest tweet from each user
        for u in users:                                     # L4: O(k) seed
            if self.tweets[u]:
                i = len(self.tweets[u]) - 1
                t, tid = self.tweets[u][i]
                heap.append((-t, u, i, tid))
        heapq.heapify(heap)                                 # L5: O(k) heapify

        feed = []
        while heap and len(feed) < 10:                     # L6: at most 10 iters
            neg_t, u, i, tid = heapq.heappop(heap)        # L7: O(log k) pop
            feed.append(tid)
            if i > 0:
                i -= 1
                t2, tid2 = self.tweets[u][i]
                heapq.heappush(heap, (-t2, u, i, tid2))   # L8: O(log k) push
        return feed

t = Twitter()
t.postTweet(1, 5)
assert t.getNewsFeed(1) == [5]

t.follow(1, 2)
t.postTweet(2, 6)
assert t.getNewsFeed(1) == [6, 5]

t.unfollow(1, 2)
assert t.getNewsFeed(1) == [5]

t2 = Twitter()
for i in range(12):
    t2.postTweet(1, i)
feed = t2.getNewsFeed(1)
assert len(feed) == 10
assert feed == list(range(11, 1, -1))

print("all tests pass")
