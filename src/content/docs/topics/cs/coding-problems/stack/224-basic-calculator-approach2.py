def calculate(s: str) -> int:
    stack = []
    result = 0
    sign = 1
    num = 0

    for ch in s:
        if ch.isdigit():
            num = num * 10 + int(ch)
        elif ch in "+-":
            result += sign * num
            num = 0
            sign = 1 if ch == "+" else -1
        elif ch == "(":
            stack.append((result, sign))
            result = 0
            sign = 1
            num = 0
        elif ch == ")":
            result += sign * num
            num = 0
            prev_result, prev_sign = stack.pop()
            result = prev_result + prev_sign * result

    return result + sign * num

assert calculate("1 + 1") == 2
assert calculate(" 2-1 + 2 ") == 3
assert calculate("(1+(4+5+2)-3)+(6+8)") == 23
assert calculate("1-(     -2)") == 3
assert calculate("- (3 + (4 + 5))") == -12
print("all tests pass")
