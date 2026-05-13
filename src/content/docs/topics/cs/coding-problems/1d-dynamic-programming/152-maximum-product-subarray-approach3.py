def max_product(nums):
    max_here = min_here = best = nums[0]
    for x in nums[1:]:
        if x < 0:
            max_here, min_here = min_here, max_here
        max_here = max(x, max_here * x)
        min_here = min(x, min_here * x)
        best = max(best, max_here)
    return best

assert max_product([2, 3, -2, 4]) == 6
assert max_product([-2, 0, -1]) == 0
assert max_product([-2, 3, -4]) == 24
assert max_product([0]) == 0
assert max_product([-3]) == -3
assert max_product([-2, -3]) == 6
print("all tests pass")
