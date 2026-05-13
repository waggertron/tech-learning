from collections import deque

def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def bfs(r, c):
        q = deque([(r, c)])
        grid[r][c] = "0"
        while q:
            x, y = q.popleft()
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == "1":
                    grid[nx][ny] = "0"
                    q.append((nx, ny))

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                bfs(r, c)
    return count

g1 = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]
assert num_islands(g1) == 1
g2 = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]
assert num_islands(g2) == 3
assert num_islands([]) == 0
assert num_islands([["1"]]) == 1
assert num_islands([["0"]]) == 0
g3 = [["1","1"],["1","1"]]
assert num_islands(g3) == 1
print("all tests pass")
