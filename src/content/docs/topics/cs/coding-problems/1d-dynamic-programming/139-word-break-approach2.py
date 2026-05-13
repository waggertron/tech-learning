from functools import lru_cache

def word_break(s, word_dict):
    words = set(word_dict)
    @lru_cache(maxsize=None)
    def f(start):
        if start == len(s):
            return True
        for end in range(start + 1, len(s) + 1):
            if s[start:end] in words and f(end):
                return True
        return False
    return f(0)

assert word_break("leetcode", ["leet", "code"]) == True
assert word_break("applepenapple", ["apple", "pen"]) == True
assert word_break("catsandog", ["cats", "dog", "sand", "and", "cat"]) == False
assert word_break("a", ["a"]) == True
assert word_break("a", ["b"]) == False
assert word_break("aaaa", ["a", "aa"]) == True
print("all tests pass")
