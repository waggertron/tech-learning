def build_lps(pattern: str) -> list[int]:
    lps = [0] * len(pattern)
    length = 0

    for i in range(1, len(pattern)):
        while length > 0 and pattern[i] != pattern[length]:
            length = lps[length - 1]
        if pattern[i] == pattern[length]:
            length += 1
        lps[i] = length

    return lps


def str_str(haystack: str, needle: str) -> int:
    m = len(needle)
    if m == 0:
        return 0
    if m > len(haystack):
        return -1

    lps = build_lps(needle)
    j = 0
    for i, char in enumerate(haystack):
        while j > 0 and char != needle[j]:
            j = lps[j - 1]
        if char == needle[j]:
            j += 1
        if j == m:
            return i - m + 1

    return -1


if __name__ == "__main__":
    cases = [
        ("sadbutsad", "sad", 0),
        ("leetcode", "leeto", -1),
        ("hello", "ll", 2),
        ("abc", "bc", 1),
        ("abc", "abc", 0),
        ("ab", "abc", -1),
        ("abababac", "ababac", 2),
        ("aaaaaa", "aaab", -1),
        ("mississippi", "issip", 4),
        ("a", "b", -1),
        ("abc", "", 0),
        ("", "a", -1),
    ]
    for text, pattern, expected in cases:
        assert str_str(text, pattern) == expected
    print("Substring examples, boundaries, and overlap checks passed.")

    assert build_lps("ababac") == [0, 0, 1, 2, 3, 0]
    assert build_lps("abab") == [0, 0, 1, 2]
    assert build_lps("aaaa") == [0, 1, 2, 3]
    assert str_str("a" * 10000, "a" * 99 + "b") == -1
    print("LPS tables and 10,000-character repetitive-input check passed.")
