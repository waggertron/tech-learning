def permute(nums):
    result = []
    nums = list(nums)

    def backtrack(start):
        if start == len(nums):
            result.append(nums[:])          # L1: O(n) copy
            return
        for i in range(start, len(nums)):
            nums[start], nums[i] = nums[i], nums[start]   # L2: O(1) swap
            backtrack(start + 1)                          # L3: recurse
            nums[start], nums[i] = nums[i], nums[start]   # L4: O(1) undo swap

    backtrack(0)
    return result

r = permute([1, 2, 3])
assert len(r) == 6
assert sorted(map(tuple, r)) == sorted([(1,2,3),(1,3,2),(2,1,3),(2,3,1),(3,1,2),(3,2,1)])
r2 = permute([0, 1])
assert sorted(map(tuple, r2)) == [(0,1),(1,0)]
assert permute([1]) == [[1]]
print("all tests pass")
