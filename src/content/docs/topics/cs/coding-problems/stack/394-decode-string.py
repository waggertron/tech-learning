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
