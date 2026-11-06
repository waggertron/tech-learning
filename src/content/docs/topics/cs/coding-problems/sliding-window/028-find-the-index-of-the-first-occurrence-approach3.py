def str_str(haystack: str, needle: str) -> int:
    n = len(haystack)
    m = len(needle)
    for i in range(n - m + 1):
        if haystack.startswith(needle, i):
            return i
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
