def longest_consecutive(nums: list[int]) -> int:
    if not nums:
        return 0
    nums_sorted = sorted(set(nums))
    best = cur = 1
    for i in range(1, len(nums_sorted)):
        if nums_sorted[i] == nums_sorted[i - 1] + 1:
            cur += 1
            best = max(best, cur)
        else:
            cur = 1
    return best

assert longest_consecutive([100, 4, 200, 1, 3, 2]) == 4
assert longest_consecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]) == 9
assert longest_consecutive([]) == 0
assert longest_consecutive([1]) == 1
assert longest_consecutive([1, 2, 3, 4, 5]) == 5
assert longest_consecutive([5, 4, 3, 2, 1]) == 5
print("all tests pass")
