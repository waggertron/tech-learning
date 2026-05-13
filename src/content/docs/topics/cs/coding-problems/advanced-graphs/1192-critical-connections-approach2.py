from collections import defaultdict

def critical_connections(n, connections):
    graph = defaultdict(list)
    for u, v in connections:
        graph[u].append(v)
        graph[v].append(u)

    disc = [-1] * n
    low = [0] * n
    bridges = []
    timer = [0]

    def dfs(node, parent):
        disc[node] = low[node] = timer[0]
        timer[0] += 1
        for neighbor in graph[node]:
            if neighbor == parent:
                continue
            if disc[neighbor] == -1:
                dfs(neighbor, node)
                low[node] = min(low[node], low[neighbor])
                if low[neighbor] > disc[node]:
                    bridges.append([node, neighbor])
            else:
                low[node] = min(low[node], disc[neighbor])

    for i in range(n):
        if disc[i] == -1:
            dfs(i, -1)
    return bridges

assert critical_connections(4, [[0,1],[1,2],[2,0],[1,3]]) == [[1,3]]
assert critical_connections(2, [[0,1]]) == [[0,1]]
assert critical_connections(3, [[0,1],[1,2],[0,2]]) == []
result = critical_connections(6, [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[1,3]])
assert sorted(result) == [[1,3]]
print("all tests pass")
