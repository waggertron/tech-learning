def reverse_words(s: str) -> str:
    words = []
    i = len(s) - 1

    while i >= 0:
        while i >= 0 and s[i] == " ":
            i -= 1
        if i < 0:
            break

        end = i + 1
        while i >= 0 and s[i] != " ":
            i -= 1
        words.append(s[i + 1:end])

    return " ".join(words)


if __name__ == "__main__":
    cases = [
        ("the sky is blue", "blue is sky the"),
        ("  hello world  ", "world hello"),
        ("a good   example", "example good a"),
        ("a", "a"),
        (" a ", "a"),
        ("Alpha2   BETA9", "BETA9 Alpha2"),
        ("one  two three    ", "three two one"),
        ("word" + " " * 9996, "word"),
        ("x" * 10000, "x" * 10000),
    ]
    for text, expected in cases:
        assert reverse_words(text) == expected
    print("Reverse Words examples and boundary cases passed.")
