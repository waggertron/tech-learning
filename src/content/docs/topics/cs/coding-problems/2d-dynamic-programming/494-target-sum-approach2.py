from functools import lru_cache

def find_target_sum_ways(nums, target):
    @lru_cache(maxsize=None)
    def f(i, cur):
        if i == len(nums):
            return 1 if cur == target else 0
        return f(i + 1, cur + nums[i]) + f(i + 1, cur - nums[i])
    return f(0, 0)

assert find_target_sum_ways([1, 1, 1, 1, 1], 3) == 5
assert find_target_sum_ways([1], 1) == 1
assert find_target_sum_ways([1, 1], 0) == 2
assert find_target_sum_ways([1, 2], 4) == 0
assert find_target_sum_ways([1], -1) == 1
assert find_target_sum_ways([0, 0, 0], 0) == 8
print("all tests pass")
