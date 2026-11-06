def reverse_words(s: str) -> str:
    backwards = []
    current_word = ""
    in_word = False

    for i in range(len(s) - 1, -1, -1):
        char = s[i]
        if char == " ":
            if in_word:
                backwards.append(current_word)
                current_word = ""
                in_word = False
        else:
            current_word = char + current_word
            in_word = True

    if current_word != "":
        backwards.append(current_word)
    return " ".join(backwards)


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
