def search(nums: list, target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

assert search([-1, 0, 3, 5, 9, 12], 9) == 4
assert search([-1, 0, 3, 5, 9, 12], 2) == -1
assert search([5], 5) == 0
assert search([5], 3) == -1
assert search([-1, 0, 3, 5, 9, 12], -1) == 0
assert search([-1, 0, 3, 5, 9, 12], 12) == 5
print("all tests pass")
