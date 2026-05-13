from bisect import bisect_left

def two_sum(numbers: list[int], target: int) -> list[int]:
    n = len(numbers)                                    # L1: O(1)
    for i in range(n):                                  # L2: outer loop, n iterations
        need = target - numbers[i]                      # L3: O(1) complement
        j = bisect_left(numbers, need, i + 1, n)        # L4: O(log n) binary search
        if j < n and numbers[j] == need:                # L5: O(1) verify
            return [i + 1, j + 1]                       # L6: O(1) return
    return []

assert two_sum([2, 7, 11, 15], 9) == [1, 2]
assert two_sum([2, 3, 4], 6) == [1, 3]
assert two_sum([3, 3], 6) == [1, 2]
assert two_sum([1, 2, 3, 4, 5], 9) == [4, 5]
assert two_sum([-3, -1, 0, 2, 4], 1) == [1, 5]
print('all tests pass')
