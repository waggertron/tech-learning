def longest_palindrome(s: str) -> str:
    n = len(s)
    if n <= 1:
        return s
    dp = [[False] * n for _ in range(n)]
    best = s[0]

    for i in range(n):
        dp[i][i] = True

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and (length == 2 or dp[i + 1][j - 1]):
                dp[i][j] = True
                if length > len(best):
                    best = s[i:j + 1]
    return best

assert longest_palindrome("babad") in ("bab", "aba")
assert longest_palindrome("cbbd") == "bb"
assert longest_palindrome("a") == "a"
assert longest_palindrome("ac") in ("a", "c")
assert longest_palindrome("racecar") == "racecar"
assert longest_palindrome("abacaba") == "abacaba"
print("all tests pass")
