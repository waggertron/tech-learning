from functools import lru_cache

def check_valid_string(s: str) -> bool:
    @lru_cache(maxsize=None)
    def f(i: int, opens: int) -> bool:
        if opens < 0:
            return False
        if i == len(s):
            return opens == 0
        if s[i] == '(':
            return f(i + 1, opens + 1)
        if s[i] == ')':
            return f(i + 1, opens - 1)
        return (f(i + 1, opens + 1)
                or f(i + 1, opens)
                or f(i + 1, opens - 1))
    return f(0, 0)

assert check_valid_string('()') == True
assert check_valid_string('(*)') == True
assert check_valid_string('(*))') == True
assert check_valid_string('((') == False
assert check_valid_string('*') == True
assert check_valid_string('(*') == True
assert check_valid_string(')') == False
print("all tests pass")
