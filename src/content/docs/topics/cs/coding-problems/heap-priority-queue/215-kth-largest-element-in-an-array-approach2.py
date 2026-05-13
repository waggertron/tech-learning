import heapq

def find_kth_largest(nums, k):
    heap = []
    for x in nums:                 # L1: iterate n elements
        heapq.heappush(heap, x)    # L2: O(log k) push
        if len(heap) > k:
            heapq.heappop(heap)    # L3: O(log k) pop to keep size k
    return heap[0]

assert find_kth_largest([3, 2, 1, 5, 6, 4], 2) == 5
assert find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) == 4
assert find_kth_largest([1], 1) == 1
assert find_kth_largest([2, 2, 2, 2], 2) == 2
assert find_kth_largest([5, 3, 1, 4, 2], 5) == 1
print("all tests pass")
