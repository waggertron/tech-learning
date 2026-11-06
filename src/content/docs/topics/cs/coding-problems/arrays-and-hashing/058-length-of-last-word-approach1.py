def length_of_last_word(s: str) -> int:
    length = 0
    in_word = False
    for char in s:
        if char == " ":
            in_word = False
            continue
        if not in_word:
            length = 0
            in_word = True
        length += 1
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
