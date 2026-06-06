from collections import defaultdict

def find_order(num_courses: int, prerequisites: list[list[int]]) -> list[int]:
    graph = defaultdict(list)
    for a, b in prerequisites:
        graph[b].append(a)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * num_courses
    order = []
    has_cycle = False

    def dfs(n):
        nonlocal has_cycle
        if has_cycle:
            return
        color[n] = GRAY
        for nb in graph[n]:
            if color[nb] == WHITE:
                dfs(nb)
            elif color[nb] == GRAY:
                has_cycle = True
                return
        color[n] = BLACK
        order.append(n)

    for c in range(num_courses):
        if color[c] == WHITE:
            dfs(c)

    if has_cycle:
        return []
    return order[::-1]

assert find_order(2, [[1, 0]]) == [0, 1]
result = find_order(4, [[1,0],[2,0],[3,1],[3,2]])
assert result.index(0) < result.index(1)
assert result.index(0) < result.index(2)
assert result.index(1) < result.index(3)
assert result.index(2) < result.index(3)
assert find_order(2, [[1, 0],[0, 1]]) == []
assert find_order(1, []) == [0]
result2 = find_order(3, [])
assert set(result2) == {0, 1, 2}
assert find_order(3, [[0,1],[1,2],[2,0]]) == []
print("all tests pass")
