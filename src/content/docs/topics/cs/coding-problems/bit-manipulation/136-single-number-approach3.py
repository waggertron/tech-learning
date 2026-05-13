def single_number(nums):
    result = 0                              # L1: O(1)
    for x in nums:                          # L2: single pass, n iterations
        result ^= x                         # L3: O(1), XOR accumulate
    return result

assert single_number([2, 2, 1]) == 1
assert single_number([4, 1, 2, 1, 2]) == 4
assert single_number([1]) == 1
assert single_number([0, 0, 99]) == 99
assert single_number([-1, -1, 42]) == 42
assert single_number([2 ** 31 - 1]) == 2 ** 31 - 1
print("all tests pass")
