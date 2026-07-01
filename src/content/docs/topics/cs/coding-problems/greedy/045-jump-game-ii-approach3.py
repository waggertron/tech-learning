def jump(nums: list[int]) -> int:
    jumps = 0
    current_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
    return jumps

assert jump([2, 3, 1, 1, 4]) == 2
assert jump([2, 3, 0, 1, 4]) == 2
assert jump([1]) == 0
assert jump([1, 1, 1, 1]) == 3
assert jump([5, 4, 3, 2, 1, 0]) == 1
print("all tests pass")
