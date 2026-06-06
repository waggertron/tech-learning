from bisect import bisect_left

def search_matrix(matrix: list[list[int]], target: int) -> bool:
    for row in matrix:
        if row[0] <= target <= row[-1]:
            i = bisect_left(row, target)
            if i < len(row) and row[i] == target:
                return True
    return False

m = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
assert search_matrix(m, 3) == True
assert search_matrix(m, 13) == False
assert search_matrix([[1]], 1) == True
assert search_matrix([[1]], 2) == False
assert search_matrix([[1, 3]], 3) == True
assert search_matrix([[1], [3]], 1) == True
print("all tests pass")
