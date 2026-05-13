import heapq

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    heap = []
    result = []
    for i, x in enumerate(nums):              # L1: outer loop, n iterations
        heapq.heappush(heap, (-x, i))          # L2: O(log n) push
        if i >= k - 1:
            while heap[0][1] <= i - k:         # L3: lazy eviction loop
                heapq.heappop(heap)            # L4: O(log n) per eviction
            result.append(-heap[0][0])         # L5: O(1) read top
    return result

assert max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3) == [3, 3, 5, 5, 6, 7]
assert max_sliding_window([1], 1) == [1]
assert max_sliding_window([1, -1], 1) == [1, -1]
assert max_sliding_window([9, 8, 7, 6, 5], 3) == [9, 8, 7]
assert max_sliding_window([1, 2, 3, 4, 5], 3) == [3, 4, 5]
print("all tests pass")
