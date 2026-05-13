def missing_number(nums):
    result = len(nums)                      # L1: O(1), start with n
    for i, x in enumerate(nums):            # L2: single pass, n iterations
        result ^= i ^ x                     # L3: O(1), cancel paired values
    return result

assert missing_number([3, 0, 1]) == 2
assert missing_number([0, 1]) == 2
assert missing_number([9, 6, 4, 2, 3, 5, 7, 0, 1]) == 8
assert missing_number([0]) == 1
assert missing_number([1]) == 0
assert missing_number([0, 1, 2, 4, 5]) == 3
print("all tests pass")
