def str_str(haystack: str, needle: str) -> int:
    return haystack.find(needle)

assert str_str("sadbutsad", "sad") == 0
assert str_str("leetcode", "leeto") == -1
assert str_str("hello", "ll") == 2
assert str_str("a", "a") == 0
assert str_str("mississippi", "issip") == 4
assert str_str("abc", "") == 0
assert str_str("", "a") == -1
print("all tests pass")
