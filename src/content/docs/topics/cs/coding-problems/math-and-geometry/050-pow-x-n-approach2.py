def my_pow(x: float, n: int) -> float:
    if n < 0:                           # L1: O(1)
        x = 1 / x                       # L2: O(1)
        n = -n                          # L3: O(1)

    def helper(base: float, exp: int) -> float:
        if exp == 0:
            return 1                    # L4: base case O(1)
        half = helper(base, exp // 2)   # L5: recurse on half exponent
        if exp % 2 == 0:
            return half * half          # L6: O(1)
        return half * half * base       # L7: O(1) for odd exp

    return helper(x, n)

assert abs(my_pow(2.0, 10) - 1024.0) < 1e-9
assert abs(my_pow(2.0, -2) - 0.25) < 1e-9
assert abs(my_pow(2.0, 0) - 1.0) < 1e-9
assert abs(my_pow(1.0, 1000000) - 1.0) < 1e-9
assert abs(my_pow(0.0, 5) - 0.0) < 1e-9
assert abs(my_pow(2.0, 1) - 2.0) < 1e-9
print("all tests pass")
