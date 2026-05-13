def combination_sum(candidates, target):
    candidates.sort()                  # L1: O(n log n) sort once
    result = []
    path = []

    def backtrack(start, remaining):
        if remaining == 0:
            result.append(path[:])     # L2: O(k) copy at leaf
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break                  # L3: O(1) prune entire suffix
            path.append(candidates[i])         # L4: O(1) push
            backtrack(i, remaining - candidates[i])  # L5: recurse
            path.pop()                         # L6: O(1) pop

    backtrack(0, target)
    return result

r = combination_sum([2, 3, 6, 7], 7)
assert sorted(map(tuple, r)) == sorted([tuple([2, 2, 3]), tuple([7])])
r2 = combination_sum([2, 3, 5], 8)
assert sorted(map(tuple, r2)) == sorted([tuple([2, 2, 2, 2]), tuple([2, 3, 3]), tuple([3, 5])])
assert combination_sum([3], 9) == [[3, 3, 3]]
assert combination_sum([5], 3) == []
print("all tests pass")
