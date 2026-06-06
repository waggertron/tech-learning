def find_circle_num(isConnected: list[list[int]]) -> int:
    n = len(isConnected)
    visited = [False] * n
    provinces = 0

    def dfs(city):
        visited[city] = True
        for neighbor in range(n):
            if isConnected[city][neighbor] == 1 and not visited[neighbor]:
                dfs(neighbor)

    for city in range(n):
        if not visited[city]:
            provinces += 1
            dfs(city)
    return provinces

assert find_circle_num([[1,1,0],[1,1,0],[0,0,1]]) == 2
assert find_circle_num([[1,0,0],[0,1,0],[0,0,1]]) == 3
assert find_circle_num([[1,1,1],[1,1,1],[1,1,1]]) == 1
assert find_circle_num([[1]]) == 1
assert find_circle_num([[1,1,0],[1,1,1],[0,1,1]]) == 1
print("all tests pass")
