from functools import lru_cache


def can_jump(nums: list[int]) -> bool:
    n = len(nums)

    @lru_cache(maxsize=None)
    def good(i: int) -> bool:
        if i >= n - 1:
            return True

        furthest = min(i + nums[i], n - 1)
        for j in range(furthest, i, -1):
            if good(j):
                return True
        return False

    return good(0)

assert can_jump([2, 3, 1, 1, 4]) == True
assert can_jump([3, 2, 1, 0, 4]) == False
assert can_jump([0]) == True
assert can_jump([1, 0]) == True
assert can_jump([0, 1]) == False
assert can_jump([2, 0, 0]) == True
print("all tests pass")
