from collections import deque

def longest_increasing_path(matrix: list[list[int]]) -> int:
    if not matrix:
        return 0
    rows, cols = len(matrix), len(matrix[0])
    in_deg = [[0] * cols for _ in range(rows)]
    dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))
    for r in range(rows):
        for c in range(cols):
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] < matrix[r][c]:
                    in_deg[r][c] += 1
    q = deque()
    for r in range(rows):
        for c in range(cols):
            if in_deg[r][c] == 0:
                q.append((r, c))
    levels = 0
    while q:
        levels += 1
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                    in_deg[nr][nc] -= 1
                    if in_deg[nr][nc] == 0:
                        q.append((nr, nc))
    return levels

assert longest_increasing_path([[9, 9, 4], [6, 6, 8], [2, 1, 1]]) == 4
assert longest_increasing_path([[3, 4, 5], [3, 2, 6], [2, 2, 1]]) == 4
assert longest_increasing_path([[1]]) == 1
assert longest_increasing_path([[1, 1], [1, 1]]) == 1
assert longest_increasing_path([[1, 2, 3, 4]]) == 4
print("all tests pass")
