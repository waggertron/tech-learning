import heapq

def find_kth_largest(nums, k):
    heap = []
    for n in nums:
        heapq.heappush(heap, n)
        if len(heap) > k:
            heapq.heappop(heap)
    
    return heap[0]

def _run_tests():
    # Examples from problem statement
    assert find_kth_largest([3,2,1,5,6,4], 2) == 5
    assert find_kth_largest([3,2,3,1,2,4,5,5,6], 4) == 4
    # k = 1: largest
    assert find_kth_largest([1], 1) == 1
    # All same
    assert find_kth_largest([2,2,2,2], 2) == 2
    # k = n: smallest
    assert find_kth_largest([5,3,1,4,2], 5) == 1
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()