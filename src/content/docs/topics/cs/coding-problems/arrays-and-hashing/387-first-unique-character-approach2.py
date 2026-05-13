from collections import Counter

def first_uniq_char(s: str) -> int:
    counts = Counter(s)
    for i, ch in enumerate(s):
        if counts[ch] == 1:
            return i
    return -1

assert first_uniq_char("leetcode") == 0
assert first_uniq_char("loveleetcode") == 2
assert first_uniq_char("aabb") == -1
assert first_uniq_char("z") == 0
assert first_uniq_char("aab") == 2
assert first_uniq_char("cc") == -1
print("all tests pass")
