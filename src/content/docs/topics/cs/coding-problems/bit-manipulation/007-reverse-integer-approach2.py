INT_MIN = -2 ** 31
INT_MAX = 2 ** 31 - 1

def reverse(x: int) -> int:
    sign = -1 if x < 0 else 1              # L1: O(1)
    x = abs(x)                             # L2: O(1)
    result = 0
    while x:                               # L3: loop d times (d = digits)
        digit = x % 10                     # L4: O(1)
        x //= 10                           # L5: O(1)
        if sign == 1 and (result > INT_MAX // 10 or (result == INT_MAX // 10 and digit > 7)):
            return 0                        # L6: O(1) overflow guard
        if sign == -1 and (result > -INT_MIN // 10 or (result == -INT_MIN // 10 and digit > 8)):
            return 0                        # L7: O(1) overflow guard
        result = result * 10 + digit       # L8: O(1)
    return sign * result

assert reverse(123) == 321
assert reverse(-123) == -321
assert reverse(120) == 21
assert reverse(0) == 0
assert reverse(2 ** 31 - 1) == 0
assert reverse(1534236469) == 0
print("all tests pass")
