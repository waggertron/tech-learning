from functools import lru_cache

def is_interleave(s1, s2, s3):
    if len(s1) + len(s2) != len(s3):
        return False
    @lru_cache(maxsize=None)
    def f(i, j):
        k = i + j
        if k == len(s3):
            return True
        if i < len(s1) and s1[i] == s3[k] and f(i + 1, j):
            return True
        if j < len(s2) and s2[j] == s3[k] and f(i, j + 1):
            return True
        return False
    return f(0, 0)

assert is_interleave("aabcc", "dbbca", "aadbbcbcac") == True
assert is_interleave("aabcc", "dbbca", "aadbbbaccc") == False
assert is_interleave("", "", "") == True
assert is_interleave("a", "", "a") == True
assert is_interleave("", "b", "b") == True
assert is_interleave("a", "b", "abc") == False
print("all tests pass")
