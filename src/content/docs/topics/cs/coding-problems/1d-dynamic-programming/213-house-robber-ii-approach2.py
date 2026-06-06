def rob(nums: list[int]) -> int:
    def rob_linear(arr: list[int]) -> int:
        prev2, prev1 = 0, 0
        for x in arr:
            prev2, prev1 = prev1, max(prev1, prev2 + x)
        return prev1

    if len(nums) == 1:
        return nums[0]
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))

assert rob([2, 3, 2]) == 3
assert rob([1, 2, 3, 1]) == 4
assert rob([1, 2, 3]) == 3
assert rob([5]) == 5
assert rob([1, 3]) == 3
assert rob([2, 7, 9, 3, 1]) == 11
print("all tests pass")
