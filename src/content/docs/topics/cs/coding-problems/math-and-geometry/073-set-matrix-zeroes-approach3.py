def set_zeroes(matrix: list[list[int]]) -> None:
    rows, cols = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][c] == 0 for c in range(cols))    # L1: O(n)
    first_col_zero = any(matrix[r][0] == 0 for r in range(rows))    # L2: O(m)

    # Use first row/col as markers
    for r in range(1, rows):                    # L3: mark pass (m-1)*(n-1)
        for c in range(1, cols):
            if matrix[r][c] == 0:
                matrix[r][0] = 0               # L4: O(1)
                matrix[0][c] = 0               # L5: O(1)

    # Zero based on markers
    for r in range(1, rows):                    # L6: apply pass (m-1)*(n-1)
        for c in range(1, cols):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0               # L7: O(1)

    if first_row_zero:
        for c in range(cols):
            matrix[0][c] = 0                   # L8: O(n)
    if first_col_zero:
        for r in range(rows):
            matrix[r][0] = 0                   # L9: O(m)

m = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
set_zeroes(m)
assert m == [[1, 0, 1], [0, 0, 0], [1, 0, 1]]
m2 = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]
set_zeroes(m2)
assert m2 == [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]
m3 = [[1]]
set_zeroes(m3)
assert m3 == [[1]]
m4 = [[0]]
set_zeroes(m4)
assert m4 == [[0]]
print("all tests pass")
