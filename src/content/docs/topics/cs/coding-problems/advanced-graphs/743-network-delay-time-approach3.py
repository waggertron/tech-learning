import heapq
from collections import defaultdict

def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))

    dist = {k: 0}
    heap = [(0, k)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, float('inf')):
            continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist.get(v, float('inf')):
                dist[v] = nd
                heapq.heappush(heap, (nd, v))

    if len(dist) != n:
        return -1
    return max(dist.values())

assert network_delay_time([[2,1,1],[2,3,1],[3,4,1]], 4, 2) == 2
assert network_delay_time([[1,2,1]], 2, 1) == 1
assert network_delay_time([[1,2,1]], 2, 2) == -1
assert network_delay_time([], 1, 1) == 0
assert network_delay_time([[1,2,1],[1,2,5]], 2, 1) == 1
print("all tests pass")
