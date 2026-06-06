def min_cost_connect_points(points: list[list[int]]) -> int:
    n = len(points)
    edges = []
    for i in range(n):
        for j in range(i + 1, n):
            d = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
            edges.append((d, i, j))
    edges.sort()

    parent = list(range(n))

    def find(x: int) -> int:
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    total = 0
    edges_added = 0
    for d, i, j in edges:
        ri, rj = find(i), find(j)
        if ri != rj:
            parent[ri] = rj
            total += d
            edges_added += 1
            if edges_added == n - 1:
                break
    return total

assert min_cost_connect_points([[0,0],[2,2],[3,10],[5,2],[7,0]]) == 20
assert min_cost_connect_points([[3,12],[-2,5],[-4,1]]) == 18
assert min_cost_connect_points([[0,0]]) == 0
assert min_cost_connect_points([[0,0],[1,1]]) == 2
assert min_cost_connect_points([[0,0],[1,0],[2,0],[3,0]]) == 3
print("all tests pass")
