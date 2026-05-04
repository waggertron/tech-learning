class Node:

    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

def copy_random_list(head):
    pass  # TODO: implement

def _run_tests():
    assert copy_random_list(None) is None
    n1 = Node(1)
    n1.random = n1
    copy = copy_random_list(n1)
    assert copy is not n1
    assert copy.val == 1
    assert copy.random is copy
    a = Node(7)
    b = Node(13)
    a.next = b
    b.random = a
    copy = copy_random_list(a)
    assert copy is not a
    assert copy.val == 7
    assert copy.next.val == 13
    assert copy.next.random is copy
    x = Node(1)
    y = Node(2)
    z = Node(3)
    x.next = y
    y.next = z
    x.random = z
    y.random = None
    z.random = x
    copy = copy_random_list(x)
    assert copy.val == 1
    assert copy.random.val == 3
    assert copy.next.random is None
    assert copy.next.next.random is copy
    orig_nodes = set()
    cur = x
    while cur:
        orig_nodes.add(id(cur))
        cur = cur.next
    cur = copy
    while cur:
        assert id(cur) not in orig_nodes
        cur = cur.next
    # --- large-input timing ---
    import time as _t
    _nodes = [Node(i) for i in range(1000)]
    for i in range(len(_nodes) - 1):
        _nodes[i].next = _nodes[i + 1]
    for i in range(len(_nodes)):
        _nodes[i].random = _nodes[i % 7]
    _t0 = _t.perf_counter()
    copy_random_list(_nodes[0])
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf copy_random_list(1000 nodes with random pointers): {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
