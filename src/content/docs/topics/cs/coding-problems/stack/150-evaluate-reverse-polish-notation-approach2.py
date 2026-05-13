def eval_rpn(tokens: list[str]) -> int:
    ops = {
        "+": lambda a, b: a + b,
        "-": lambda a, b: a - b,
        "*": lambda a, b: a * b,
        "/": lambda a, b: int(a / b),
    }
    stack = []
    for tok in tokens:
        if tok in ops:
            b = stack.pop()
            a = stack.pop()
            stack.append(ops[tok](a, b))
        else:
            stack.append(int(tok))
    return stack[0]

assert eval_rpn(["2","1","+","3","*"]) == 9
assert eval_rpn(["4","13","5","/","+"]) == 6
assert eval_rpn(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]) == 22
assert eval_rpn(["3"]) == 3
assert eval_rpn(["6","2","/"]) == 3
assert eval_rpn(["7","2","/"]) == 3
assert eval_rpn(["-7","2","/"]) == -3
print("all tests pass")
