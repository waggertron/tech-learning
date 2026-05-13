def search_matrix(matrix: list, target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        r, c = divmod(mid, n)
        if matrix[r][c] == target:
            return True
        if matrix[r][c] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False

mat = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
assert search_matrix(mat, 3) == True
assert search_matrix(mat, 13) == False
assert search_matrix([[1]], 1) == True
assert search_matrix([[1]], 2) == False
assert search_matrix([[1, 3]], 3) == True
assert search_matrix([[1], [3]], 1) == True
print("all tests pass")
