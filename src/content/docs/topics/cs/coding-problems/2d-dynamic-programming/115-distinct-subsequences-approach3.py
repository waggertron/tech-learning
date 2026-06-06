def num_distinct(s: str, t: str) -> int:
    m, n = len(s), len(t)
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(m):
        for j in range(n, 0, -1):
            if s[i] == t[j - 1]:
                dp[j] += dp[j - 1]
    return dp[n]

assert num_distinct("rabbbit", "rabbit") == 3
assert num_distinct("babgbag", "bag") == 5
assert num_distinct("abc", "") == 1
assert num_distinct("", "a") == 0
assert num_distinct("abc", "abc") == 1
assert num_distinct("aaa", "b") == 0
print("all tests pass")
