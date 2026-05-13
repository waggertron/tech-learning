from collections import deque

def update_matrix(mat):
    rows, cols = len(mat), len(mat[0])
    dist = [[float('inf')] * cols for _ in range(rows)]
    q = deque()
    for r in range(rows):
        for c in range(cols):
            if mat[r][c] == 0:
                dist[r][c] = 0
                q.append((r, c))
    while q:
        r, c = q.popleft()
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and dist[nr][nc] == float('inf'):
                dist[nr][nc] = dist[r][c] + 1
                q.append((nr, nc))
    return dist

assert update_matrix([[0,0,0],[0,1,0],[0,0,0]]) == [[0,0,0],[0,1,0],[0,0,0]]
assert update_matrix([[0,0,0],[0,1,0],[1,1,1]]) == [[0,0,0],[0,1,0],[1,2,1]]
assert update_matrix([[0,0],[0,0]]) == [[0,0],[0,0]]
assert update_matrix([[0]]) == [[0]]
assert update_matrix([[0,0,0],[0,0,0],[0,0,1]]) == [[0,0,0],[0,0,0],[0,0,1]]
print("all tests pass")
