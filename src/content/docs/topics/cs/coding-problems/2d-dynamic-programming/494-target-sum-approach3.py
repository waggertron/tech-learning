def find_target_sum_ways(nums: list[int], target: int) -> int:
    total = sum(nums)
    if (total + target) % 2 or total < abs(target):
        return 0
    P = (total + target) // 2
    dp = [0] * (P + 1)
    dp[0] = 1
    for x in nums:
        for s in range(P, x - 1, -1):
            dp[s] += dp[s - x]
    return dp[P]

assert find_target_sum_ways([1, 1, 1, 1, 1], 3) == 5
assert find_target_sum_ways([1], 1) == 1
assert find_target_sum_ways([1, 1], 0) == 2
assert find_target_sum_ways([1, 2], 4) == 0
assert find_target_sum_ways([1], -1) == 1
assert find_target_sum_ways([0, 0, 0], 0) == 8
print("all tests pass")
