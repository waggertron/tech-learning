def search(nums: list[int], target: int) -> int:
    def helper(lo: int, hi: int) -> int:
        if lo > hi:
            return -1
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            return helper(mid + 1, hi)
        return helper(lo, mid - 1)
    return helper(0, len(nums) - 1)

assert search([-1, 0, 3, 5, 9, 12], 9) == 4
assert search([-1, 0, 3, 5, 9, 12], 2) == -1
assert search([5], 5) == 0
assert search([5], 3) == -1
assert search([-1, 0, 3, 5, 9, 12], -1) == 0
assert search([-1, 0, 3, 5, 9, 12], 12) == 5
print("all tests pass")
