def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()                                        # L1: O(n log n)
    n = len(nums)                                      # L2: O(1)
    result = []                                        # L3: O(1)
    for i in range(n - 2):                             # L4: outer loop
        if nums[i] > 0:                                # L5: O(1) prune: all remaining >= 0
            break
        if i > 0 and nums[i] == nums[i - 1]:           # L6: O(1) skip duplicate anchor
            continue
        l, r = i + 1, n - 1                            # L7: O(1) init pointers
        while l < r:                                   # L8: two-pointer scan
            s = nums[i] + nums[l] + nums[r]            # L9: O(1) sum
            if s < 0:                                  # L10: O(1)
                l += 1                                 # L11: O(1)
            elif s > 0:                                # L12: O(1)
                r -= 1                                 # L13: O(1)
            else:
                result.append([nums[i], nums[l], nums[r]])  # L14: O(1)
                l += 1                                 # L15: O(1)
                r -= 1                                 # L16: O(1)
                while l < r and nums[l] == nums[l - 1]:  # L17: skip l-dupes
                    l += 1
                while l < r and nums[r] == nums[r + 1]:  # L18: skip r-dupes
                    r -= 1
    return result

def normalize(result):
    return sorted(tuple(t) for t in result)

assert normalize(three_sum([-1, 0, 1, 2, -1, -4])) == [(-1, -1, 2), (-1, 0, 1)]
assert three_sum([0, 1, 1]) == []
assert three_sum([0, 0, 0]) == [[0, 0, 0]]
assert three_sum([]) == []
assert three_sum([-2, 0, 0, 2, 2]) == [[-2, 0, 2]]
print('all tests pass')
