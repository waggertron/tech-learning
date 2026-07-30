def min_sub_array_len(target: int, nums: list[int]) -> int:
    left = 0
    total = 0
    best = len(nums) + 1

    for right, value in enumerate(nums):                 # L1: right expands n times
        total += value                                    # L2: O(1) add entering value
        while total >= target:                            # L3: shrink while window is valid
            best = min(best, right - left + 1)            # L4: O(1) record current length
            total -= nums[left]                           # L5: O(1) remove leaving value
            left += 1                                     # L6: left advances at most n times

    return 0 if best == len(nums) + 1 else best           # L7: O(1)


assert min_sub_array_len(7, [2, 3, 1, 2, 4, 3]) == 2
assert min_sub_array_len(4, [1, 4, 4]) == 1
assert min_sub_array_len(11, [1, 1, 1, 1, 1, 1, 1, 1]) == 0
assert min_sub_array_len(3, [1, 1, 1]) == 3
assert min_sub_array_len(15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]) == 2
print("all tests pass")
