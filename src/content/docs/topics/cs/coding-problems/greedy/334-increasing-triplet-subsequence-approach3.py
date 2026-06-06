def increasing_triplet(nums: list[int]) -> bool:
    first = second = float('inf')
    for n in nums:
        if n <= first:
            first = n
        elif n <= second:
            second = n
        else:
            return True
    return False

assert increasing_triplet([1, 2, 3, 4, 5]) == True
assert increasing_triplet([5, 4, 3, 2, 1]) == False
assert increasing_triplet([2, 1, 5, 0, 4, 6]) == True
assert increasing_triplet([1, 2]) == False
assert increasing_triplet([1, 1, 1, 1, 1]) == False
assert increasing_triplet([20, 100, 10, 12, 5, 13]) == True
print("all tests pass")
