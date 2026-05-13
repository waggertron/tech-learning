def two_sum(numbers: list[int], target: int) -> list[int]:
    l, r = 0, len(numbers) - 1           # L1: O(1) init pointers
    while l < r:                          # L2: at most n iterations
        s = numbers[l] + numbers[r]       # L3: O(1) sum
        if s == target:                   # L4: O(1) check
            return [l + 1, r + 1]         # L5: O(1) return (1-indexed)
        if s < target:                    # L6: O(1)
            l += 1                        # L7: O(1) advance left
        else:
            r -= 1                        # L8: O(1) advance right
    return []

assert two_sum([2, 7, 11, 15], 9) == [1, 2]
assert two_sum([2, 3, 4], 6) == [1, 3]
assert two_sum([3, 3], 6) == [1, 2]
assert two_sum([1, 2, 3, 4, 5], 9) == [4, 5]
assert two_sum([-3, -1, 0, 2, 4], 1) == [1, 5]
print('all tests pass')
