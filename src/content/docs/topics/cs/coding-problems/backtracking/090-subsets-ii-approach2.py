def subsets_with_dup(nums):
    nums.sort()                               # L1: O(n log n) sort
    result = []
    path = []

    def backtrack(start):
        result.append(path[:])                # L2: O(k) copy at every node (not just leaves)
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue                      # L3: O(1) skip same-level duplicate
            path.append(nums[i])              # L4: O(1) push
            backtrack(i + 1)                  # L5: recurse
            path.pop()                        # L6: O(1) pop

    backtrack(0)
    return result

r = subsets_with_dup([1, 2, 2])
assert sorted(map(tuple, r)) == sorted([(), (1,), (2,), (1,2), (2,2), (1,2,2)])
r2 = subsets_with_dup([0])
assert sorted(map(tuple, r2)) == [(), (0,)]
r3 = subsets_with_dup([2, 2, 2])
assert sorted(map(tuple, r3)) == sorted([(), (2,), (2,2), (2,2,2)])
print("all tests pass")
