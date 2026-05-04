import heapq

class MedianFinder:
    def __init__(self):
        self.lo = [] 
        self.hi = []
    
    def addNum(self, num):
        heapq.heappush(self.lo, -num)

        highest_lo = -heapq.heappop(self.lo)
        heapq.heappush(self.hi, highest_lo)

        if len(self.hi) > len(self.lo):
            lowest_hi = heapq.heappop(self.hi)
            heapq.heappush(self.lo, -lowest_hi)
    
    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return float(-self.lo[0])
        else:
            return (-self.lo[0] + self.hi[0]) / 2.0

def _run_tests():
    # Example from problem statement
    mf = MedianFinder()
    mf.addNum(1); mf.addNum(2)
    assert mf.findMedian() == 1.5
    mf.addNum(3)
    assert mf.findMedian() == 2.0

    # Single element
    mf2 = MedianFinder()
    mf2.addNum(42)
    assert mf2.findMedian() == 42.0

    # Odd count median
    mf3 = MedianFinder()
    for v in [5, 3, 8, 1, 9]:
        mf3.addNum(v)
    # sorted: [1,3,5,8,9] -> median = 5
    assert mf3.findMedian() == 5.0

    # Even count median
    mf4 = MedianFinder()
    for v in [2, 4, 6, 8]:
        mf4.addNum(v)
    # sorted: [2,4,6,8] -> median = (4+6)/2 = 5.0
    assert mf4.findMedian() == 5.0

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    mf_big = MedianFinder()
    for i in range(1000):
        mf_big.addNum(i)
        mf_big.findMedian()
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf MedianFinder 1000 addNum+findMedian: {_ms:.1f}ms')

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()