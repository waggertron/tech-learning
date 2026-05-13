def reverse_bits(n):
    return int(f"{n:032b}"[::-1], 2)        # L1: O(32) format + reverse + parse

assert reverse_bits(43261596) == 964176192
assert reverse_bits(4294967293) == 3221225471
assert reverse_bits(0) == 0
assert reverse_bits(4294967295) == 4294967295
assert reverse_bits(1) == 2147483648
print("all tests pass")
