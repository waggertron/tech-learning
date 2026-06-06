from collections import defaultdict

def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    graph = defaultdict(list)
    for a, b in prerequisites:
        graph[b].append(a)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * num_courses

    def dfs(n):
        if color[n] == GRAY:
            return False
        if color[n] == BLACK:
            return True
        color[n] = GRAY
        for nb in graph[n]:
            if not dfs(nb):
                return False
        color[n] = BLACK
        return True

    for c in range(num_courses):
        if not dfs(c):
            return False
    return True

assert can_finish(2, [[1, 0]]) == True
assert can_finish(2, [[1, 0], [0, 1]]) == False
assert can_finish(5, []) == True
assert can_finish(1, []) == True
assert can_finish(3, [[1, 0], [2, 1], [0, 2]]) == False
assert can_finish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]) == True
print("all tests pass")
