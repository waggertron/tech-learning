def count_bits(n: int) -> list[int]:
    dp = [0] * (n + 1)                      # L1: O(n)
    for i in range(1, n + 1):               # L2: single pass, n iterations
        dp[i] = dp[i & (i - 1)] + 1         # L3: O(1) per i
    return dp

assert count_bits(2) == [0, 1, 1]
assert count_bits(5) == [0, 1, 1, 2, 1, 2]
assert count_bits(0) == [0]
assert count_bits(1) == [0, 1]
assert count_bits(8) == [0, 1, 1, 2, 1, 2, 2, 3, 1]
print("all tests pass")
