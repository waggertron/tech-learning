def two_sum(nums: list[int], target: int) -> list[int]:
    indexed = sorted(enumerate(nums), key=lambda p: p[1])
    l, r = 0, len(indexed) - 1
    while l < r:
        s = indexed[l][1] + indexed[r][1]
        if s == target:
            return sorted([indexed[l][0], indexed[r][0]])
        if s < target:
            l += 1
        else:
            r -= 1
    return []

assert two_sum([2, 7, 11, 15], 9) == [0, 1]
assert two_sum([3, 2, 4], 6) == [1, 2]
assert two_sum([3, 3], 6) == [0, 1]
assert two_sum([1, 2, 3, 4, 5], 9) == [3, 4]
assert two_sum([0, 4], 4) == [0, 1]
print("all tests pass")
