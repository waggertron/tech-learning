def single_number(nums: list[int]) -> int:
    nums.sort()                             # L1: O(n log n)
    for i in range(0, len(nums) - 1, 2):   # L2: scan in steps of 2
        if nums[i] != nums[i + 1]:         # L3: O(1)
            return nums[i]
    return nums[-1]                         # L4: last element is single

assert single_number([2, 2, 1]) == 1
assert single_number([4, 1, 2, 1, 2]) == 4
assert single_number([1]) == 1
assert single_number([0, 0, 99]) == 99
assert single_number([-1, -1, 42]) == 42
assert single_number([2 ** 31 - 1]) == 2 ** 31 - 1
print("all tests pass")
