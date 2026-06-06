def increasing_triplet(nums: list[int]) -> bool:
    n = len(nums)
    if n < 3:
        return False
    min_left = [0] * n
    max_right = [0] * n
    min_left[0] = nums[0]
    for i in range(1, n):
        min_left[i] = min(min_left[i - 1], nums[i])
    max_right[n - 1] = nums[n - 1]
    for i in range(n - 2, -1, -1):
        max_right[i] = max(max_right[i + 1], nums[i])
    for j in range(1, n - 1):
        if min_left[j - 1] < nums[j] < max_right[j + 1]:
            return True
    return False

assert increasing_triplet([1, 2, 3, 4, 5]) == True
assert increasing_triplet([5, 4, 3, 2, 1]) == False
assert increasing_triplet([2, 1, 5, 0, 4, 6]) == True
assert increasing_triplet([1, 2]) == False
assert increasing_triplet([1, 1, 1, 1, 1]) == False
assert increasing_triplet([20, 100, 10, 12, 5, 13]) == True
print("all tests pass")
