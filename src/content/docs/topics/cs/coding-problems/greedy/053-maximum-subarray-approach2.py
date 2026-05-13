def max_subarray(nums):
    def helper(lo, hi):
        if lo == hi:
            return nums[lo]
        mid = (lo + hi) // 2
        left_max = helper(lo, mid)
        right_max = helper(mid + 1, hi)

        left_suffix = right_prefix = float('-inf')
        total = 0
        for i in range(mid, lo - 1, -1):
            total += nums[i]
            left_suffix = max(left_suffix, total)
        total = 0
        for i in range(mid + 1, hi + 1):
            total += nums[i]
            right_prefix = max(right_prefix, total)

        return max(left_max, right_max, left_suffix + right_prefix)
    return helper(0, len(nums) - 1)

assert max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
assert max_subarray([1]) == 1
assert max_subarray([5, 4, -1, 7, 8]) == 23
assert max_subarray([-1]) == -1
assert max_subarray([-2, -3, -1, -5]) == -1
assert max_subarray([1, 2, 3, 4, 5]) == 15
print("all tests pass")
