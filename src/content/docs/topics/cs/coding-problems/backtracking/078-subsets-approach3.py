def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    path = []

    def backtrack(i: int) -> None:
        if i == len(nums):
            result.append(path[:])    # L1: O(n) copy at leaf
            return
        # exclude
        backtrack(i + 1)              # L2: recurse without nums[i]
        # include
        path.append(nums[i])          # L3: O(1) push
        backtrack(i + 1)              # L4: recurse with nums[i]
        path.pop()                    # L5: O(1) pop

    backtrack(0)
    return result

r = subsets([1, 2, 3])
assert len(r) == 8
assert sorted(map(tuple, r)) == sorted([(), (1,), (2,), (3,), (1,2), (1,3), (2,3), (1,2,3)])
r2 = subsets([0])
assert sorted(map(tuple, r2)) == [(), (0,)]
assert subsets([]) == [[]]
print("all tests pass")
