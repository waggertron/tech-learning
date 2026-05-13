def can_jump(nums):
    n = len(nums)
    dp = [False] * n
    dp[n - 1] = True
    for i in range(n - 1, 0, -1):
        furthest = min(i + nums[i], n - 1)
        for j in range(i + 1, furthest + 1):
            if dp[j]:
                dp[i] = True
                break
    return dp[0]

assert can_jump([2, 3, 1, 1, 4]) == True
assert can_jump([3, 2, 1, 0, 4]) == False
assert can_jump([0]) == True
assert can_jump([1, 0]) == True
assert can_jump([0, 1]) == False
assert can_jump([2, 0, 0]) == True
print("all tests pass")
