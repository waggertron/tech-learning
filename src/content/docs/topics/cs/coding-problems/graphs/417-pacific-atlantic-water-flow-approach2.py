def pacific_atlantic(heights):
    if not heights:
        return []
    rows, cols = len(heights), len(heights[0])
    pac = set()
    atl = set()

    def dfs(r, c, visited):
        if (r, c) in visited:
            return
        visited.add((r, c))
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and heights[nr][nc] >= heights[r][c]:
                dfs(nr, nc, visited)

    for c in range(cols):
        dfs(0, c, pac)
        dfs(rows - 1, c, atl)
    for r in range(rows):
        dfs(r, 0, pac)
        dfs(r, cols - 1, atl)

    return sorted([r, c] for (r, c) in pac & atl)

h1 = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
assert pacific_atlantic(h1) == [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
assert pacific_atlantic([[5]]) == [[0, 0]]
h2 = [[1, 1], [1, 1]]
assert sorted(pacific_atlantic(h2)) == [[0,0],[0,1],[1,0],[1,1]]
h3 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
r3 = pacific_atlantic(h3)
assert [2, 2] in r3
assert pacific_atlantic([]) == []
print("all tests pass")
