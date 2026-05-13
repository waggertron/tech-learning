from collections import defaultdict

def four_sum_count(nums1: list[int], nums2: list[int], nums3: list[int], nums4: list[int]) -> int:
    ab_counts = defaultdict(int)
    for a in nums1:
        for b in nums2:
            ab_counts[a + b] += 1
    result = 0
    for c in nums3:
        for d in nums4:
            result += ab_counts[-(c + d)]
    return result

assert four_sum_count([1,2], [-2,-1], [-1,2], [0,2]) == 2
assert four_sum_count([0], [0], [0], [0]) == 1
assert four_sum_count([-1,-1], [-1,1], [-1,1], [1,-1]) == 6
print("all tests pass")
