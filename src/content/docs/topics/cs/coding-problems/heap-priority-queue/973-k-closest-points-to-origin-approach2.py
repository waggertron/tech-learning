import heapq

def k_closest(points, k):
    # Max-heap via negated distance
    heap = []
    for x, y in points:                       # L1: iterate n points
        d = -(x * x + y * y)
        if len(heap) < k:
            heapq.heappush(heap, (d, x, y))   # L2: O(log k) push
        elif d > heap[0][0]:
            heapq.heapreplace(heap, (d, x, y)) # L3: O(log k) replace farthest
    return [[x, y] for _, x, y in heap]

result = k_closest([[1, 3], [-2, 2]], 1)
assert result == [[-2, 2]], f"got {result}"

result = k_closest([[3, 3], [5, -1], [-2, 4]], 2)
assert sorted(result) == sorted([[3, 3], [-2, 4]]), f"got {result}"

assert k_closest([[0, 0]], 1) == [[0, 0]]

result = k_closest([[1, 0], [-1, 0], [0, 1], [0, -1]], 2)
assert len(result) == 2

result = k_closest([[1, 2], [3, 4], [0, 0]], 3)
assert len(result) == 3

print("all tests pass")
