def longest_consecutive(nums: list[int]) -> int:
    num_set = set(nums)
    best = 0
    for x in num_set:
        if x - 1 in num_set:
            continue
        cur = x
        length = 1
        while cur + 1 in num_set:
            cur += 1
            length += 1
        best = max(best, length)
    return best

assert longest_consecutive([100, 4, 200, 1, 3, 2]) == 4
assert longest_consecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]) == 9
assert longest_consecutive([]) == 0
assert longest_consecutive([1]) == 1
assert longest_consecutive([1, 2, 3, 4, 5]) == 5
assert longest_consecutive([5, 4, 3, 2, 1]) == 5
print("all tests pass")
