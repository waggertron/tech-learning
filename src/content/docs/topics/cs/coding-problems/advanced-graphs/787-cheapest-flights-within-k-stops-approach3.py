def find_cheapest_price(n, flights, src, dst, k):
    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0
    for _ in range(k + 1):
        new_dist = dist.copy()
        for u, v, w in flights:
            if dist[u] != INF and dist[u] + w < new_dist[v]:
                new_dist[v] = dist[u] + w
        dist = new_dist
    return -1 if dist[dst] == INF else dist[dst]

flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]
assert find_cheapest_price(4, flights, 0, 3, 1) == 700
assert find_cheapest_price(4, flights, 0, 3, 0) == -1
assert find_cheapest_price(4, flights, 0, 3, 2) == 400
assert find_cheapest_price(2, [[0,1,500]], 0, 1, 0) == 500
assert find_cheapest_price(3, [[0,1,100],[1,2,50]], 1, 1, 1) == 0
assert find_cheapest_price(3, [[0,1,100]], 0, 2, 5) == -1
print("all tests pass")
