def get_sum(a, b):
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF
    while b != 0:                               # L1: loop at most 32 times
        a, b = (a ^ b) & MASK, ((a & b) << 1) & MASK  # L2: O(1) per iter
    return a if a <= MAX_INT else ~(a ^ MASK)   # L3: O(1) sign correction

assert get_sum(1, 2) == 3
assert get_sum(2, 3) == 5
assert get_sum(0, 0) == 0
assert get_sum(-1, 1) == 0
assert get_sum(-5, 3) == -2
assert get_sum(2 ** 30, 2 ** 30) == 2 ** 31
print("all tests pass")
