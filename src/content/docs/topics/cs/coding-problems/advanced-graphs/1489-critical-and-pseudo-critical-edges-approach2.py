class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        return True

def find_critical_and_pseudo_critical_edges(n, edges):
    indexed = [(w, u, v, i) for i, (u, v, w) in enumerate(edges)]
    indexed.sort()

    def kruskal(skip=-1, force=-1):
        uf = UnionFind(n)
        weight = 0
        count = 0
        if force != -1:
            w, u, v, _ = indexed[force]
            uf.union(u, v)
            weight += w
            count += 1
        for idx, (w, u, v, orig) in enumerate(indexed):
            if idx == skip:
                continue
            if uf.union(u, v):
                weight += w
                count += 1
        return float('inf') if count < n - 1 else weight

    base = kruskal()
    critical, pseudo = [], []
    for i in range(len(indexed)):
        if kruskal(skip=i) > base:
            critical.append(indexed[i][3])
        elif kruskal(force=i) == base:
            pseudo.append(indexed[i][3])
    critical.sort()
    pseudo.sort()
    return [critical, pseudo]

assert find_critical_and_pseudo_critical_edges(5, [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]) == [[0,1],[2,3,4,5]]
assert find_critical_and_pseudo_critical_edges(4, [[0,1,1],[1,2,1],[2,3,1],[0,3,1]]) == [[],[0,1,2,3]]
assert find_critical_and_pseudo_critical_edges(2, [[0,1,5]]) == [[0],[]]
print("all tests pass")
