def find_peak_element(nums: list) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < nums[mid + 1]:
            lo = mid + 1
        else:
            hi = mid
    return lo

result = find_peak_element([1, 2, 3, 1])
assert result == 2, result

result = find_peak_element([1, 2, 1, 3, 5, 6, 4])
assert result in (1, 5), result

assert find_peak_element([1]) == 0
assert find_peak_element([1, 2, 3]) == 2
assert find_peak_element([3, 2, 1]) == 0
print("all tests pass")
