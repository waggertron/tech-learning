def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for c in coins:
        for s in range(c, amount + 1):
            dp[s] += dp[s - c]
    return dp[amount]

assert change(5, [1, 2, 5]) == 4
assert change(3, [2]) == 0
assert change(0, [1, 2, 5]) == 1
assert change(10, [5]) == 1
assert change(10, [1, 5, 10]) == 4
print("all tests pass")
