def length_of_last_word(s: str) -> int:
    i = len(s) - 1
    while i >= 0 and s[i] == " ":
        i -= 1
    length = 0
    while i >= 0 and s[i] != " ":
        length += 1
        i -= 1
    return length


if __name__ == "__main__":
    cases = [
        ("Hello World", 5),
        ("   fly me   to   the moon  ", 4),
        ("luffy is still joyboy", 6),
        ("go moon  ", 4),
        ("a", 1),
        (" a ", 1),
        ("a  bc   ", 2),
        ("ABC", 3),
        ("x" * 10000, 10000),
        ("word" + " " * 9996, 4),
    ]
    for text, expected in cases:
        assert length_of_last_word(text) == expected
    print("Length of Last Word examples and boundary cases passed.")
