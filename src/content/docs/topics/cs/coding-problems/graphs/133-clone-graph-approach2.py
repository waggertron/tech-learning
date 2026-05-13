from collections import deque

class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors or []

def clone_graph(node):
    if not node:
        return None
    old_to_new = {node: Node(node.val)}
    q = deque([node])
    while q:
        cur = q.popleft()
        for nb in cur.neighbors:
            if nb not in old_to_new:
                old_to_new[nb] = Node(nb.val)
                q.append(nb)
            old_to_new[cur].neighbors.append(old_to_new[nb])
    return old_to_new[node]

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
cb = ca.neighbors[0]
assert cb is not b
assert cb.val == 2
assert cb.neighbors[0] is ca
print("all tests pass")
