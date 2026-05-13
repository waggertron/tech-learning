import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []   # max-heap (negated)
        self.hi = []   # min-heap

    def addNum(self, num):
        heapq.heappush(self.lo, -num)                     # L1: O(log n) push to lo
        # Push the largest of `lo` into `hi`
        heapq.heappush(self.hi, -heapq.heappop(self.lo))  # L2: O(log n) pop+push
        # Rebalance: lo should be at least as large as hi
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))  # L3: O(log n) rebalance

    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return float(-self.lo[0])           # L4: O(1) read lo top
        return (-self.lo[0] + self.hi[0]) / 2  # L5: O(1) average both tops

mf = MedianFinder()
mf.addNum(1); mf.addNum(2)
assert mf.findMedian() == 1.5
mf.addNum(3)
assert mf.findMedian() == 2.0

mf2 = MedianFinder()
mf2.addNum(42)
assert mf2.findMedian() == 42.0

mf3 = MedianFinder()
for v in [5, 3, 8, 1, 9]:
    mf3.addNum(v)
assert mf3.findMedian() == 5.0

mf4 = MedianFinder()
for v in [2, 4, 6, 8]:
    mf4.addNum(v)
assert mf4.findMedian() == 5.0

print("all tests pass")
