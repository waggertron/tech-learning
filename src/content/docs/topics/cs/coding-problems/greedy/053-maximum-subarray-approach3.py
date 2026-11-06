def max_subarray(nums: list[int]) -> int:
    best = cur = nums[0]
    for i in range(1, len(nums)):
        x = nums[i]
        cur = max(x, cur + x)
        best = max(best, cur)
    return best

assert max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
assert max_subarray([1]) == 1
assert max_subarray([5, 4, -1, 7, 8]) == 23
assert max_subarray([-1]) == -1
assert max_subarray([-2, -3, -1, -5]) == -1
assert max_subarray([1, 2, 3, 4, 5]) == 15
assert max_subarray([-4, 3, 2, -8]) == 5
assert max_subarray([-5, -2, -7]) == -2
assert max_subarray([0]) == 0
print("all tests pass")
