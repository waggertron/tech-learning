def generate_parenthesis(n: int) -> list[str]:
    result = []
    path = []

    def backtrack(opens, closes):
        if opens == n and closes == n:
            result.append("".join(path))
            return
        if opens < n:
            path.append("(")
            backtrack(opens + 1, closes)
            path.pop()
        if closes < opens:
            path.append(")")
            backtrack(opens, closes + 1)
            path.pop()

    backtrack(0, 0)
    return result

assert sorted(generate_parenthesis(1)) == ["()"]
assert sorted(generate_parenthesis(2)) == sorted(["(())", "()()"])
assert sorted(generate_parenthesis(3)) == sorted(["((()))","(()())","(())()","()(())","()()()"])
assert len(generate_parenthesis(4)) == 14
print("all tests pass")
