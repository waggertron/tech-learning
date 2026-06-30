def can_jump(nums: list[int]) -> bool:
    leftmost_good = len(nums) - 1

    for i in range(len(nums) - 2, -1, -1):
        if i + nums[i] >= leftmost_good:
            leftmost_good = i

    return leftmost_good == 0


assert can_jump([2, 3, 1, 1, 4]) == True
assert can_jump([3, 2, 1, 0, 4]) == False
assert can_jump([0]) == True
assert can_jump([1, 0]) == True
assert can_jump([0, 1]) == False
assert can_jump([2, 0, 0]) == True
print("all tests pass")
