from collections import deque

def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                q.append((r, c, 0))
            elif grid[r][c] == 1:
                fresh += 1

    time = 0
    while q:
        r, c, t = q.popleft()
        time = t
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                q.append((nr, nc, t + 1))

    return time if fresh == 0 else -1

assert oranges_rotting([[2,1,1],[1,1,0],[0,1,1]]) == 4
assert oranges_rotting([[2,1,1],[0,1,1],[1,0,1]]) == -1
assert oranges_rotting([[0,2]]) == 0
assert oranges_rotting([[1,1],[1,1]]) == -1
assert oranges_rotting([[0]]) == 0
assert oranges_rotting([[2,1]]) == 1
print("all tests pass")
