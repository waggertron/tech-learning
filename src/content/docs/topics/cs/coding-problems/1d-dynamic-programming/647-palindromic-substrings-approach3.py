def count_substrings(s):
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    count = 0
    for i in range(n):
        dp[i][i] = True
        count += 1
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and (length == 2 or dp[i + 1][j - 1]):
                dp[i][j] = True
                count += 1
    return count

assert count_substrings("abc") == 3
assert count_substrings("aaa") == 6
assert count_substrings("a") == 1
assert count_substrings("aa") == 3
assert count_substrings("abba") == 6
assert count_substrings("racecar") == 10
print("all tests pass")
