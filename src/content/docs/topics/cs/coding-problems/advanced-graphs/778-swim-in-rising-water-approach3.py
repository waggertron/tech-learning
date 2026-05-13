def swim_in_water(grid):
    n = len(grid)
    cells = sorted((grid[r][c], r, c) for r in range(n) for c in range(n))
    parent = list(range(n * n))
    active = [False] * (n * n)

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    for v, r, c in cells:
        idx = r * n + c
        active[idx] = True
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and active[nr * n + nc]:
                union(idx, nr * n + nc)
        if find(0) == find(n * n - 1):
            return v
    return -1

assert swim_in_water([[0,2],[1,3]]) == 3
assert swim_in_water([[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]) == 16
assert swim_in_water([[0]]) == 0
assert swim_in_water([[7]]) == 7
assert swim_in_water([[0,1],[3,2]]) == 2
print("all tests pass")
