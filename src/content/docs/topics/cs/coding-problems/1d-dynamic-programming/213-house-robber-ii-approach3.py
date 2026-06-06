def rob(nums: list[int]) -> int:
    def rob_range(lo: int, hi: int) -> int:
        prev2, prev1 = 0, 0
        for i in range(lo, hi):
            prev2, prev1 = prev1, max(prev1, prev2 + nums[i])
        return prev1

    if len(nums) == 1:
        return nums[0]
    return max(rob_range(0, len(nums) - 1), rob_range(1, len(nums)))

assert rob([2, 3, 2]) == 3
assert rob([1, 2, 3, 1]) == 4
assert rob([1, 2, 3]) == 3
assert rob([5]) == 5
assert rob([1, 3]) == 3
assert rob([2, 7, 9, 3, 1]) == 11
print("all tests pass")
