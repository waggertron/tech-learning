def decode_string(s: str) -> str:
    stack = []
    current_string = ""
    current_count = 0

    for ch in s:
        if ch.isdigit():
            current_count = current_count * 10 + int(ch)
        elif ch == "[":
            stack.append((current_count, current_string))
            current_count = 0
            current_string = ""
        elif ch == "]":
            count, prefix = stack.pop()
            current_string = prefix + count * current_string
        else:
            current_string += ch

    return current_string

assert decode_string("3[a]2[bc]") == "aaabcbc"
assert decode_string("3[a2[c]]") == "accaccacc"
assert decode_string("2[abc]3[cd]ef") == "abcabccdcdcdef"
assert decode_string("a") == "a"
print("all tests pass")
