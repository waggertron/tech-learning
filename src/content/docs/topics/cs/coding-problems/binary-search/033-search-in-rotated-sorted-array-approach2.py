def search(nums: list, target: int) -> int:
    # Step 1: find rotation pivot (index of min)
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    pivot = lo
    # Step 2: pick which half to binary-search
    if pivot == 0 or target < nums[0]:
        lo, hi = pivot, len(nums) - 1
    else:
        lo, hi = 0, pivot - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

assert search([4, 5, 6, 7, 0, 1, 2], 0) == 4
assert search([4, 5, 6, 7, 0, 1, 2], 3) == -1
assert search([1], 0) == -1
assert search([1], 1) == 0
assert search([3, 1], 1) == 1
assert search([3, 1], 3) == 0
print("all tests pass")
