def is_valid(s: str) -> bool:
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        else:
            if not stack:
                return False
            top = stack.pop()
            if (ch == ")" and top != "(") or \
               (ch == "]" and top != "[") or \
               (ch == "}" and top != "{"):
                return False
    return not stack

assert is_valid("()") == True
assert is_valid("()[]{}") == True
assert is_valid("(]") == False
assert is_valid("([)]") == False
assert is_valid("{[]}") == True
assert is_valid("") == True
assert is_valid("(") == False
assert is_valid(")") == False
print("all tests pass")
