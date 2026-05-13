def plus_one(digits):
    for i in range(len(digits) - 1, -1, -1):    # L1: walk right to left
        if digits[i] < 9:                        # L2: O(1)
            digits[i] += 1                       # L3: O(1), no carry needed
            return digits
        digits[i] = 0                            # L4: O(1), carry continues
    return [1] + digits                          # L5: O(n), all nines case

assert plus_one([1, 2, 3]) == [1, 2, 4]
assert plus_one([9, 9, 9]) == [1, 0, 0, 0]
assert plus_one([0]) == [1]
assert plus_one([9]) == [1, 0]
assert plus_one([1, 0, 9]) == [1, 1, 0]
assert plus_one([4, 3, 2, 1]) == [4, 3, 2, 2]
print("all tests pass")
