def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])    # L1: O(1)
    zero_rows = [False] * rows                  # L2: O(m)
    zero_cols = [False] * cols                  # L3: O(n)

    for r in range(rows):                       # L4: first pass, m*n iterations
        for c in range(cols):
            if matrix[r][c] == 0:
                zero_rows[r] = True             # L5: O(1)
                zero_cols[c] = True             # L6: O(1)

    for r in range(rows):                       # L7: second pass, m*n iterations
        for c in range(cols):
            if zero_rows[r] or zero_cols[c]:
                matrix[r][c] = 0               # L8: O(1)

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
