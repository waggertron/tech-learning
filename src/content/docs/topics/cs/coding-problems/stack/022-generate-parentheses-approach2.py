def generate_parenthesis(n: int) -> list[str]:
    result = []
    def rec(s: str, opens: int, closes: int) -> None:
        if opens > n or closes > opens:
            return
        if len(s) == 2 * n:
            result.append(s)
            return
        rec(s + "(", opens + 1, closes)
        rec(s + ")", opens, closes + 1)
    rec("", 0, 0)
    return result

assert sorted(generate_parenthesis(1)) == ["()"]
assert sorted(generate_parenthesis(2)) == sorted(["(())", "()()"])
assert sorted(generate_parenthesis(3)) == sorted(["((()))","(()())","(())()","()(())","()()()"])
assert len(generate_parenthesis(4)) == 14
print("all tests pass")
