from functools import lru_cache

def num_distinct(s: str, t: str) -> int:
    @lru_cache(maxsize=None)
    def f(i, j):
        if j == len(t):
            return 1
        if i == len(s):
            return 0
        if s[i] == t[j]:
            return f(i + 1, j + 1) + f(i + 1, j)
        return f(i + 1, j)
    return f(0, 0)

assert num_distinct("rabbbit", "rabbit") == 3
assert num_distinct("babgbag", "bag") == 5
assert num_distinct("abc", "") == 1
assert num_distinct("", "a") == 0
assert num_distinct("abc", "abc") == 1
assert num_distinct("aaa", "b") == 0
print("all tests pass")
