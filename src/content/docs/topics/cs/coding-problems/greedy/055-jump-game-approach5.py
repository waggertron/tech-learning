def can_jump(nums: list[int]) -> bool:
    max_reach = 0

    for i, x in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + x)
        if max_reach >= len(nums) - 1:
            return True

    return True


assert can_jump([2, 3, 1, 1, 4]) == True
assert can_jump([3, 2, 1, 0, 4]) == False
assert can_jump([0]) == True
assert can_jump([1, 0]) == True
assert can_jump([0, 1]) == False
assert can_jump([2, 0, 0]) == True
print("all tests pass")
