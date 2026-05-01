class Node:

    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors or []

def clone_graph(node):
    pass  # TODO: implement

def _run_tests():
    assert clone_graph(None) is None
    n1 = Node(1)
    c1 = clone_graph(n1)
    assert c1 is not n1
    assert c1.val == 1
    assert c1.neighbors == []
    a = Node(1)
    b = Node(2)
    a.neighbors = [b]
    b.neighbors = [a]
    ca = clone_graph(a)
    assert ca is not a
    assert ca.val == 1
    assert len(ca.neighbors) == 1
    cb = ca.neighbors[0]
    assert cb is not b
    assert cb.val == 2
    assert cb.neighbors[0] is ca
    nodes = [Node(i) for i in range(1, 5)]
    nodes[0].neighbors = [nodes[1], nodes[3]]
    nodes[1].neighbors = [nodes[0], nodes[2]]
    nodes[2].neighbors = [nodes[1], nodes[3]]
    nodes[3].neighbors = [nodes[2], nodes[0]]
    root_clone = clone_graph(nodes[0])
    from collections import deque
    visited = {}
    q = deque([root_clone])
    while q:
        cur = q.popleft()
        if cur.val in visited:
            continue
        visited[cur.val] = cur
        for nb in cur.neighbors:
            q.append(nb)
    assert set(visited.keys()) == {1, 2, 3, 4}
    for orig in nodes:
        assert orig not in visited.values()
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
