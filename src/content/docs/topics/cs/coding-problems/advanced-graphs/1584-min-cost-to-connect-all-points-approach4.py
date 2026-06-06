def min_cost_connect_points(points: list[list[int]]) -> int:
    n = len(points)
    in_mst = [False] * n
    min_dist = [float('inf')] * n
    min_dist[0] = 0
    total = 0
    for _ in range(n):
        u = -1
        for v in range(n):
            if not in_mst[v] and (u == -1 or min_dist[v] < min_dist[u]):
                u = v
        in_mst[u] = True
        total += min_dist[u]
        for v in range(n):
            if not in_mst[v]:
                d = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                if d < min_dist[v]:
                    min_dist[v] = d
    return total

assert min_cost_connect_points([[0,0],[2,2],[3,10],[5,2],[7,0]]) == 20
assert min_cost_connect_points([[3,12],[-2,5],[-4,1]]) == 18
assert min_cost_connect_points([[0,0]]) == 0
assert min_cost_connect_points([[0,0],[1,1]]) == 2
assert min_cost_connect_points([[0,0],[1,0],[2,0],[3,0]]) == 3
print("all tests pass")
