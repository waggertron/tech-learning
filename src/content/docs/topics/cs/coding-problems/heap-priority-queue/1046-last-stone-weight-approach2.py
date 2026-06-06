import heapq

def last_stone_weight(stones: list[int]) -> int:
    heap = [-s for s in stones]            # L1: O(n)
    heapq.heapify(heap)                    # L2: O(n) (Floyd's bottom-up)
    while len(heap) > 1:                   # L3: outer loop, up to n-1 rounds
        y = -heapq.heappop(heap)           # L4: O(log n) per call
        x = -heapq.heappop(heap)           # L5: O(log n) per call
        if x != y:
            heapq.heappush(heap, -(y - x)) # L6: O(log n) when taken
    return -heap[0] if heap else 0

assert last_stone_weight([2, 7, 4, 1, 8, 1]) == 1
assert last_stone_weight([1]) == 1
assert last_stone_weight([31, 26, 33, 21, 40]) == 9
assert last_stone_weight([9, 3, 2, 10]) == 0
assert last_stone_weight([2, 2]) == 0
assert last_stone_weight([1, 3]) == 2
print("all tests pass")
