def combination_sum(candidates, target):
    result = []
    path = []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])     # L1: O(k) copy at leaf
            return
        if remaining < 0:
            return
        for i in range(start, len(candidates)):
            path.append(candidates[i])           # L2: O(1) push
            backtrack(i, remaining - candidates[i])   # L3: recurse (reuse allowed)
            path.pop()                           # L4: O(1) pop

    backtrack(0, target)
    return result

r = combination_sum([2, 3, 6, 7], 7)
assert sorted(map(tuple, r)) == sorted([tuple([2, 2, 3]), tuple([7])])
r2 = combination_sum([2, 3, 5], 8)
assert sorted(map(tuple, r2)) == sorted([tuple([2, 2, 2, 2]), tuple([2, 3, 3]), tuple([3, 5])])
assert combination_sum([3], 9) == [[3, 3, 3]]
assert combination_sum([5], 3) == []
print("all tests pass")
