def max_coins(nums: list[int]) -> int:
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            for k in range(i + 1, j):
                coins = nums[i] * nums[k] * nums[j] + dp[i][k] + dp[k][j]
                if coins > dp[i][j]:
                    dp[i][j] = coins
    return dp[0][n - 1]

assert max_coins([3, 1, 5, 8]) == 167
assert max_coins([1, 5]) == 10
assert max_coins([5]) == 5
assert max_coins([3, 3]) == 12
assert max_coins([1, 1, 1]) == 3
print("all tests pass")
