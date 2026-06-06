def find_redundant_connection(edges: list[list[int]]) -> list[int]:
    n = len(edges)
    parent = list(range(n + 1))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        parent[ra] = rb
        return True

    for u, v in edges:
        if not union(u, v):
            return [u, v]
    return []

assert find_redundant_connection([[1,2],[1,3],[2,3]]) == [2, 3]
assert find_redundant_connection([[1,2],[2,3],[3,4],[1,4],[1,5]]) == [1, 4]
assert find_redundant_connection([[1,2],[1,2]]) == [1, 2]
assert find_redundant_connection([[1,2],[2,3],[1,3]]) == [1, 3]
assert find_redundant_connection([[1,2],[2,3],[3,4],[4,5],[3,5]]) == [3, 5]
print("all tests pass")
