def remove_duplicates(s: str) -> str:
    stack = []
    for ch in s:
        if stack and stack[-1] == ch:
            stack.pop()
        else:
            stack.append(ch)
    return "".join(stack)

assert remove_duplicates("abbaca") == "ca"
assert remove_duplicates("azxxzy") == "ay"
assert remove_duplicates("a") == "a"
assert remove_duplicates("aa") == ""
assert remove_duplicates("abcd") == "abcd"
print("all tests pass")
