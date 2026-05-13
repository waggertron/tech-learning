def contains_duplicate(nums: list[int]) -> bool:
    nums_sorted = sorted(nums)
    for i in range(1, len(nums_sorted)):
        if nums_sorted[i] == nums_sorted[i - 1]:
            return True
    return False

assert contains_duplicate([1, 2, 3, 1]) == True
assert contains_duplicate([1, 2, 3, 4]) == False
assert contains_duplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) == True
assert contains_duplicate([]) == False
assert contains_duplicate([5]) == False
assert contains_duplicate([5, 5]) == True
print("all tests pass")
