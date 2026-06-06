def can_partition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for x in nums:
        for s in range(target, x - 1, -1):
            dp[s] = dp[s] or dp[s - x]
    return dp[target]

assert can_partition([1, 5, 11, 5]) == True
assert can_partition([1, 2, 3, 5]) == False
assert can_partition([1]) == False
assert can_partition([2, 2]) == True
assert can_partition([1, 2, 5]) == False
assert can_partition([3, 3, 3, 4, 5]) == True
print("all tests pass")
