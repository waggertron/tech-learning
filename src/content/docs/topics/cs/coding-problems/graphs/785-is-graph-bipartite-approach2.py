from collections import deque

def is_bipartite(graph: list[list[int]]) -> bool:
    n = len(graph)
    color = [-1] * n

    for start in range(n):
        if color[start] != -1:
            continue
        color[start] = 0
        q = deque([start])
        while q:
            node = q.popleft()
            for neighbor in graph[node]:
                if color[neighbor] == -1:
                    color[neighbor] = 1 - color[node]
                    q.append(neighbor)
                elif color[neighbor] == color[node]:
                    return False
    return True

assert is_bipartite([[1,2,3],[0,2],[0,1,3],[0,2]]) == False
assert is_bipartite([[1,3],[0,2],[1,3],[0,2]]) == True
assert is_bipartite([[]]) == True
assert is_bipartite([[1],[0]]) == True
assert is_bipartite([[1,2],[0,2],[0,1]]) == False
assert is_bipartite([[1],[0],[3],[2]]) == True
print("all tests pass")
