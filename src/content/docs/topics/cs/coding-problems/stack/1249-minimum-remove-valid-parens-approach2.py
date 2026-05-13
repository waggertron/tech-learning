def min_remove_to_make_valid(s: str) -> str:
    stack = []
    remove = set()

    for i, ch in enumerate(s):
        if ch == "(":
            stack.append(i)
        elif ch == ")":
            if stack:
                stack.pop()
            else:
                remove.add(i)

    remove.update(stack)

    result = []
    for i, ch in enumerate(s):
        if i not in remove:
            result.append(ch)
    return "".join(result)

def is_valid(t: str) -> bool:
    count = 0
    for ch in t:
        if ch == "(":
            count += 1
        elif ch == ")":
            if count == 0:
                return False
            count -= 1
    return count == 0

result = min_remove_to_make_valid("lee(t(c)o)de)")
assert is_valid(result) and len(result) == 13
result = min_remove_to_make_valid("a)b(c)d")
assert is_valid(result) and len(result) == 6
assert min_remove_to_make_valid("))((") == ""
result = min_remove_to_make_valid("(a(b(c)d)")
assert is_valid(result)
print("all tests pass")
