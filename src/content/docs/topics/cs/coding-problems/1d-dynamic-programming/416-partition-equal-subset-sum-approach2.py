from functools import lru_cache

def can_partition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2

    @lru_cache(maxsize=None)
    def f(i: int, cur: int) -> bool:
        if cur == target:
            return True
        if i == len(nums) or cur > target:
            return False
        return f(i + 1, cur + nums[i]) or f(i + 1, cur)

    return f(0, 0)

assert can_partition([1, 5, 11, 5]) == True
assert can_partition([1, 2, 3, 5]) == False
assert can_partition([1]) == False
assert can_partition([2, 2]) == True
assert can_partition([1, 2, 5]) == False
assert can_partition([3, 3, 3, 4, 5]) == True
print("all tests pass")
