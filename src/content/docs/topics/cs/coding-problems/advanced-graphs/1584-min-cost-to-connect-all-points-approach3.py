import heapq

def min_cost_connect_points(points):
    n = len(points)
    visited = [False] * n
    heap = [(0, 0)]
    total = 0
    count = 0

    while heap and count < n:
        d, u = heapq.heappop(heap)
        if visited[u]:
            continue
        visited[u] = True
        total += d
        count += 1
        for v in range(n):
            if not visited[v]:
                dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                heapq.heappush(heap, (dist, v))

    return total

assert min_cost_connect_points([[0,0],[2,2],[3,10],[5,2],[7,0]]) == 20
assert min_cost_connect_points([[3,12],[-2,5],[-4,1]]) == 18
assert min_cost_connect_points([[0,0]]) == 0
assert min_cost_connect_points([[0,0],[1,1]]) == 2
assert min_cost_connect_points([[0,0],[1,0],[2,0],[3,0]]) == 3
print("all tests pass")
