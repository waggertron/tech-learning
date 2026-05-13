def permute(nums):
    result = []
    n = len(nums)
    used = [False] * n
    path = []

    def backtrack():
        if len(path) == n:
            result.append(path[:])      # L1: O(n) copy at leaf
            return
        for i in range(n):
            if used[i]:
                continue                # L2: O(1) skip used
            used[i] = True             # L3: O(1) mark used
            path.append(nums[i])        # L4: O(1) push
            backtrack()                 # L5: recurse
            path.pop()                 # L6: O(1) pop
            used[i] = False            # L7: O(1) unmark

    backtrack()
    return result

r = permute([1, 2, 3])
assert len(r) == 6
assert sorted(map(tuple, r)) == sorted([(1,2,3),(1,3,2),(2,1,3),(2,3,1),(3,1,2),(3,2,1)])
r2 = permute([0, 1])
assert sorted(map(tuple, r2)) == [(0,1),(1,0)]
assert permute([1]) == [[1]]
print("all tests pass")
