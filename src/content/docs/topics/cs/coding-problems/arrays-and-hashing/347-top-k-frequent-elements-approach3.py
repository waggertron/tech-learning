from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts = Counter(nums)
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, cnt in counts.items():
        buckets[cnt].append(num)
    result = []
    for cnt in range(len(buckets) - 1, 0, -1):
        for num in buckets[cnt]:
            result.append(num)
            if len(result) == k:
                return result
    return result

assert sorted(top_k_frequent([1, 1, 1, 2, 2, 3], 2)) == [1, 2]
assert top_k_frequent([1], 1) == [1]
assert sorted(top_k_frequent([1, 2], 2)) == [1, 2]
r = top_k_frequent([1, 2, 3], 1)
assert len(r) == 1 and r[0] in [1, 2, 3]
print("all tests pass")
