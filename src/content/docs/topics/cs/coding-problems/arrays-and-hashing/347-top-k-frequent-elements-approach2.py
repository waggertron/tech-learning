from collections import Counter
import heapq

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    heap = []
    for num, cnt in counts.items():
        heapq.heappush(heap, (cnt, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [num for _, num in heap]

assert sorted(top_k_frequent([1, 1, 1, 2, 2, 3], 2)) == [1, 2]
assert top_k_frequent([1], 1) == [1]
assert sorted(top_k_frequent([1, 2], 2)) == [1, 2]
r = top_k_frequent([1, 2, 3], 1)
assert len(r) == 1 and r[0] in [1, 2, 3]
print("all tests pass")
