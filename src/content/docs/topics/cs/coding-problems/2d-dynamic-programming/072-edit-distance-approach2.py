from functools import lru_cache

def min_distance(word1: str, word2: str) -> int:
    @lru_cache(maxsize=None)
    def f(i, j):
        if i == len(word1):
            return len(word2) - j
        if j == len(word2):
            return len(word1) - i
        if word1[i] == word2[j]:
            return f(i + 1, j + 1)
        return 1 + min(f(i + 1, j), f(i, j + 1), f(i + 1, j + 1))
    return f(0, 0)

assert min_distance("horse", "ros") == 3
assert min_distance("intention", "execution") == 5
assert min_distance("", "") == 0
assert min_distance("abc", "") == 3
assert min_distance("", "abc") == 3
assert min_distance("abc", "abc") == 0
print("all tests pass")
