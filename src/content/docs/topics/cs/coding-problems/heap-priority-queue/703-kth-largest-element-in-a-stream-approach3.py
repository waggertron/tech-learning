import heapq

class KthLargest:
    def __init__(self, k: int, nums: list):
        self.k = k
        self.heap = []
        for x in nums:
            self.add(x)              # L1: O(log k) per initial element

    def add(self, val: int) -> int:
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)      # L2: O(log k) push
        elif val > self.heap[0]:
            heapq.heapreplace(self.heap, val)   # L3: O(log k) pop+push atomic
        return self.heap[0]                     # L4: O(1) peek top

kl = KthLargest(3, [4, 5, 8, 2])
assert kl.add(3) == 4
assert kl.add(5) == 5
assert kl.add(10) == 5
assert kl.add(9) == 8
assert kl.add(4) == 8

kl2 = KthLargest(1, [])
assert kl2.add(3) == 3
assert kl2.add(5) == 5
assert kl2.add(1) == 5

kl3 = KthLargest(2, [1, 2])
assert kl3.add(0) == 1
assert kl3.add(3) == 2

print("all tests pass")
