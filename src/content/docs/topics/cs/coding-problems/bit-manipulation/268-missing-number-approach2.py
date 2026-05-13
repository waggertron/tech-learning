def missing_number(nums):
    n = len(nums)                           # L1: O(1)
    return n * (n + 1) // 2 - sum(nums)    # L2: O(n)

assert missing_number([3, 0, 1]) == 2
assert missing_number([0, 1]) == 2
assert missing_number([9, 6, 4, 2, 3, 5, 7, 0, 1]) == 8
assert missing_number([0]) == 1
assert missing_number([1]) == 0
assert missing_number([0, 1, 2, 4, 5]) == 3
print("all tests pass")
