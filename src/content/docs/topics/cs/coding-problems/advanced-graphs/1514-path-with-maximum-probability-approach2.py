import heapq
from collections import defaultdict

def max_probability(n, edges, succ_prob, start, end):
    graph = defaultdict(list)
    for i, (u, v) in enumerate(edges):
        graph[u].append((v, succ_prob[i]))
        graph[v].append((u, succ_prob[i]))

    prob = [0.0] * n
    prob[start] = 1.0
    heap = [(-1.0, start)]

    while heap:
        neg_p, u = heapq.heappop(heap)
        p = -neg_p
        if p < prob[u]:
            continue
        if u == end:
            return p
        for v, edge_p in graph[u]:
            new_p = p * edge_p
            if new_p > prob[v]:
                prob[v] = new_p
                heapq.heappush(heap, (-new_p, v))

    return prob[end]

assert abs(max_probability(3, [[0,1],[1,2],[0,2]], [0.5,0.5,0.2], 0, 2) - 0.25) < 1e-5
assert abs(max_probability(3, [[0,1],[1,2],[0,2]], [0.5,0.5,0.3], 0, 2) - 0.3) < 1e-5
assert max_probability(3, [[0,1]], [0.5], 0, 2) == 0.0
assert abs(max_probability(2, [[0,1]], [0.9], 0, 1) - 0.9) < 1e-5
assert abs(max_probability(3, [[0,1],[1,2]], [0.5,0.5], 1, 1) - 1.0) < 1e-5
print("all tests pass")
