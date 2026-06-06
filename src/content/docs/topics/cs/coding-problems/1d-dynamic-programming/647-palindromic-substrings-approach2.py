def count_substrings(s: str) -> int:
    def expand(l: int, r: int) -> int:
        count = 0
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1
            r += 1
        return count

    return sum(expand(i, i) + expand(i, i + 1) for i in range(len(s)))

assert count_substrings("abc") == 3
assert count_substrings("aaa") == 6
assert count_substrings("a") == 1
assert count_substrings("aa") == 3
assert count_substrings("abba") == 6
assert count_substrings("racecar") == 10
print("all tests pass")
