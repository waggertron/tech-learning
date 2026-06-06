from collections import deque

def shortest_path_binary_matrix(grid: list[list[int]]) -> int:
    n = len(grid)
    if grid[0][0] == 1 or grid[n-1][n-1] == 1:
        return -1
    if n == 1:
        return 1
    q = deque([(0, 0, 1)])
    grid[0][0] = 1
    DIRS = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
    while q:
        r, c, dist = q.popleft()
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                if nr == n - 1 and nc == n - 1:
                    return dist + 1
                grid[nr][nc] = 1
                q.append((nr, nc, dist + 1))
    return -1

assert shortest_path_binary_matrix([[0,1],[1,0]]) == 2
assert shortest_path_binary_matrix([[0,0,0],[1,1,0],[1,1,0]]) == 4
assert shortest_path_binary_matrix([[1,0,0],[1,1,0],[1,1,0]]) == -1
assert shortest_path_binary_matrix([[0,0,0],[0,0,0],[0,0,1]]) == -1
assert shortest_path_binary_matrix([[0]]) == 1
assert shortest_path_binary_matrix([[1]]) == -1
assert shortest_path_binary_matrix([[0,0],[0,0]]) == 2
print("all tests pass")
