from collections import defaultdict, deque

def possible_bipartition(n: int, dislikes: list[list[int]]) -> bool:
    graph = defaultdict(list)
    for a, b in dislikes:
        graph[a].append(b)
        graph[b].append(a)

    color = {}

    for start in range(1, n + 1):
        if start in color:
            continue
        color[start] = 0
        q = deque([start])
        while q:
            person = q.popleft()
            for neighbor in graph[person]:
                if neighbor not in color:
                    color[neighbor] = 1 - color[person]
                    q.append(neighbor)
                elif color[neighbor] == color[person]:
                    return False
    return True

assert possible_bipartition(4, [[1,2],[1,3],[2,4]]) == True
assert possible_bipartition(3, [[1,2],[1,3],[2,3]]) == False
assert possible_bipartition(5, [[1,2],[2,3],[3,4],[4,5],[1,5]]) == False
assert possible_bipartition(4, []) == True
assert possible_bipartition(4, [[1,2],[3,4]]) == True
assert possible_bipartition(1, []) == True
print("all tests pass")
