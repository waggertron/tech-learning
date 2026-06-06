from functools import lru_cache

def rob(nums: list[int]) -> int:
    n = len(nums)
    @lru_cache(maxsize=None)
    def f(i: int) -> int:
        if i >= n:
            return 0
        return max(nums[i] + f(i + 2), f(i + 1))
    return f(0)

assert rob([1, 2, 3, 1]) == 4
assert rob([2, 7, 9, 3, 1]) == 12
assert rob([0]) == 0
assert rob([5]) == 5
assert rob([2, 1]) == 2
assert rob([1, 3, 1, 3, 100]) == 103
print("all tests pass")
