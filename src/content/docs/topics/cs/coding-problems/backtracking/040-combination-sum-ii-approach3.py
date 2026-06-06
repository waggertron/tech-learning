def combination_sum2(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()                           # L1: O(n log n) sort
    result = []
    path = []

    def backtrack(start: int, remaining: int) -> None:
        if remaining == 0:
            result.append(path[:])              # L2: O(k) copy
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break                           # L3: O(1) prune
            if i > start and candidates[i] == candidates[i - 1]:
                continue                        # L4: O(1) skip same-level duplicate
            path.append(candidates[i])          # L5: O(1) push
            backtrack(i + 1, remaining - candidates[i])  # L6: recurse (i+1, no reuse)
            path.pop()                          # L7: O(1) pop

    backtrack(0, target)
    return result

r = combination_sum2([10, 1, 2, 7, 6, 1, 5], 8)
assert sorted(map(tuple, r)) == sorted([tuple([1,1,6]), tuple([1,2,5]), tuple([1,7]), tuple([2,6])])
r2 = combination_sum2([2, 5, 2, 1, 2], 5)
assert sorted(map(tuple, r2)) == sorted([tuple([1,2,2]), tuple([5])])
assert combination_sum2([1, 2], 10) == []
assert combination_sum2([3, 3], 3) == [[3]]
print("all tests pass")
