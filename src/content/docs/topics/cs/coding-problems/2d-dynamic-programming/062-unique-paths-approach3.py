def unique_paths(m: int, n: int) -> int:
    dp = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            dp[c] += dp[c - 1]
    return dp[n - 1]

assert unique_paths(3, 7) == 28
assert unique_paths(3, 2) == 3
assert unique_paths(1, 1) == 1
assert unique_paths(1, 5) == 1
assert unique_paths(5, 1) == 1
assert unique_paths(3, 3) == 6
print("all tests pass")
