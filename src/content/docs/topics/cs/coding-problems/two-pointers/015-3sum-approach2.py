def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()                                    # L1: O(n log n)
    n = len(nums)                                  # L2: O(1)
    result = []                                    # L3: O(1)
    for i in range(n - 2):                         # L4: outer loop, n-2 iters
        if i > 0 and nums[i] == nums[i - 1]:       # L5: O(1) skip duplicate anchor
            continue
        seen = set()                               # L6: O(1) fresh set per anchor
        j = i + 1                                  # L7: O(1)
        while j < n:                               # L8: inner scan
            need = -nums[i] - nums[j]              # L9: O(1) complement
            if need in seen:                       # L10: O(1) lookup
                result.append([nums[i], need, nums[j]])  # L11: O(1)
                while j + 1 < n and nums[j + 1] == nums[j]:  # L12: skip j-dupes
                    j += 1
            seen.add(nums[j])                      # L13: O(1)
            j += 1                                 # L14: O(1)
    return result

def normalize(result: list[list[int]]) -> list[tuple[int, ...]]:
    return sorted(tuple(t) for t in result)

assert normalize(three_sum([-1, 0, 1, 2, -1, -4])) == [(-1, -1, 2), (-1, 0, 1)]
assert three_sum([0, 1, 1]) == []
assert three_sum([0, 0, 0]) == [[0, 0, 0]]
assert three_sum([]) == []
assert three_sum([-2, 0, 0, 2, 2]) == [[-2, 0, 2]]
print('all tests pass')
