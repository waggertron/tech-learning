def valid_tree(n, edges):
    if len(edges) != n - 1:
        return False
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            return False
        parent[ru] = rv
    return True

assert valid_tree(5, [[0,1],[0,2],[0,3],[1,4]]) == True
assert valid_tree(5, [[0,1],[1,2],[2,3],[1,3],[1,4]]) == False
assert valid_tree(1, []) == True
assert valid_tree(2, [[0, 1]]) == True
assert valid_tree(2, []) == False
assert valid_tree(3, [[0,1],[1,2],[0,2]]) == False
print("all tests pass")
