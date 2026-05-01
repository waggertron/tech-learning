import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = []
        for n in nums:
            self.add(n)

    def add(self, val):
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)
        elif val > self.heap[0]:
            heapq.heapreplace(self.heap, val)
        return self.heap[0]



def _run_tests():
    # Example from problem statement: k=3, nums=[4,5,8,2]
    kl = KthLargest(3, [4, 5, 8, 2])
    assert kl.add(3) == 4
    assert kl.add(5) == 5
    assert kl.add(10) == 5
    assert kl.add(9) == 8
    assert kl.add(4) == 8

    # k=1: always return max
    kl2 = KthLargest(1, [])
    assert kl2.add(3) == 3
    assert kl2.add(5) == 5
    assert kl2.add(1) == 5

    # k equals initial size
    kl3 = KthLargest(2, [1, 2])
    assert kl3.add(0) == 1   # 3rd largest among [1,2,0] would be 0; kth=2nd=1
    assert kl3.add(3) == 2   # [0,1,2,3] kth=2nd=2

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()