def rotate(matrix: list[list[int]]) -> None:
    n = len(matrix)
    # Transpose
    for i in range(n):                              # L1: outer loop, n iterations
        for j in range(i + 1, n):                   # L2: upper-triangle only
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]  # L3: O(1) swap
    # Reverse each row
    for row in matrix:                              # L4: n rows
        row.reverse()                               # L5: O(n) per row

m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
rotate(m)
assert m == [[7, 4, 1], [8, 5, 2], [9, 6, 3]]
m2 = [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]
rotate(m2)
assert m2 == [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]
m3 = [[1]]
rotate(m3)
assert m3 == [[1]]
m4 = [[1, 2], [3, 4]]
rotate(m4)
assert m4 == [[3, 1], [4, 2]]
print("all tests pass")
