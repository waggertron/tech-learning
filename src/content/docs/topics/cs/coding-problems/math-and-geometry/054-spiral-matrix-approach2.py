def spiral_order(matrix: list[list[int]]) -> list[int]:
    if not matrix:
        return []
    result = []
    top, bottom = 0, len(matrix) - 1           # L1: O(1)
    left, right = 0, len(matrix[0]) - 1        # L2: O(1)

    while top <= bottom and left <= right:      # L3: outer loop, min(m,n)/2 rounds
        for c in range(left, right + 1):        # L4: walk top row
            result.append(matrix[top][c])       # L5: O(1) amortized
        top += 1                                # L6: shrink
        for r in range(top, bottom + 1):        # L7: walk right col
            result.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left - 1, -1):  # L8: walk bottom row
                result.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top - 1, -1):  # L9: walk left col
                result.append(matrix[r][left])
            left += 1
    return result

assert spiral_order([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [1, 2, 3, 6, 9, 8, 7, 4, 5]
assert spiral_order([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]) == [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
assert spiral_order([[1]]) == [1]
assert spiral_order([[1, 2], [3, 4]]) == [1, 2, 4, 3]
assert spiral_order([[1], [2], [3]]) == [1, 2, 3]
assert spiral_order([[1, 2, 3]]) == [1, 2, 3]
print("all tests pass")
