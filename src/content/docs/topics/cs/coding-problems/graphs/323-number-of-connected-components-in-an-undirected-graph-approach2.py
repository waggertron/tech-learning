def count_components(n: int, edges: list[list[int]]) -> int:
    parent = list(range(n))
    count = n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv
            count -= 1
    return count

assert count_components(5, [[0,1],[1,2],[3,4]]) == 2
assert count_components(5, [[0,1],[1,2],[2,3],[3,4]]) == 1
assert count_components(4, []) == 4
assert count_components(1, []) == 1
assert count_components(3, [[0,1],[1,2],[0,2]]) == 1
print("all tests pass")
