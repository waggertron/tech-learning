from functools import lru_cache

def is_match(s, p):
    @lru_cache(maxsize=None)
    def match(i, j):
        if j == len(p):
            return i == len(s)
        first = i < len(s) and (p[j] == '.' or p[j] == s[i])
        if j + 1 < len(p) and p[j + 1] == '*':
            return match(i, j + 2) or (first and match(i + 1, j))
        return first and match(i + 1, j + 1)
    return match(0, 0)

assert is_match("aa", "a") == False
assert is_match("aa", "a*") == True
assert is_match("ab", ".*") == True
assert is_match("mississippi", "mis*is*p*.") == False
assert is_match("", "") == True
assert is_match("", "a*") == True
print("all tests pass")
