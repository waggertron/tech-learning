def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    INF = float('inf')
    dist = [[INF] * (n + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dist[i][i] = 0
    for u, v, w in times:
        dist[u][v] = w
    for mid in range(1, n + 1):
        for i in range(1, n + 1):
            for j in range(1, n + 1):
                if dist[i][mid] + dist[mid][j] < dist[i][j]:
                    dist[i][j] = dist[i][mid] + dist[mid][j]
    m = max(dist[k][1:])
    return -1 if m == INF else m

assert network_delay_time([[2,1,1],[2,3,1],[3,4,1]], 4, 2) == 2
assert network_delay_time([[1,2,1]], 2, 1) == 1
assert network_delay_time([[1,2,1]], 2, 2) == -1
assert network_delay_time([], 1, 1) == 0
assert network_delay_time([[1,2,1],[1,2,5]], 2, 1) == 1
print("all tests pass")
