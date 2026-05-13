def is_interleave(s1, s2, s3):
    m, n = len(s1), len(s2)
    if m + n != len(s3):
        return False
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for i in range(m + 1):
        for j in range(n + 1):
            if i == 0 and j == 0:
                continue
            k = i + j - 1
            if i > 0 and s1[i - 1] == s3[k] and dp[i - 1][j]:
                dp[i][j] = True
            if not dp[i][j] and j > 0 and s2[j - 1] == s3[k] and dp[i][j - 1]:
                dp[i][j] = True
    return dp[m][n]

assert is_interleave("aabcc", "dbbca", "aadbbcbcac") == True
assert is_interleave("aabcc", "dbbca", "aadbbbaccc") == False
assert is_interleave("", "", "") == True
assert is_interleave("a", "", "a") == True
assert is_interleave("", "b", "b") == True
assert is_interleave("a", "b", "abc") == False
print("all tests pass")
