def hamming_weight(n: int) -> int:
    count = 0
    while n:                        # L1: loop popcount(n) times
        n &= n - 1                  # L2: O(1), clear lowest set bit
        count += 1                  # L3: O(1)
    return count

assert hamming_weight(11) == 3
assert hamming_weight(128) == 1
assert hamming_weight(0) == 0
assert hamming_weight(4294967295) == 32
assert hamming_weight(1) == 1
assert hamming_weight(183) == 6
print("all tests pass")
