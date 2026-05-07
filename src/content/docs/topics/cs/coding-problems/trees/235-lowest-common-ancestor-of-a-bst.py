class TreeNode:

    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(vals):
    if not vals:
        return None
    root = TreeNode(vals[0])
    q = [root]
    i = 1
    while q and i < len(vals):
        node = q.pop(0)
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i])
            q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i])
            q.append(node.right)
        i += 1
    return root

def find_node(root, val):
    while root:
        if val == root.val:
            return root
        root = root.left if val < root.val else root.right
    return None

def lowest_common_ancestor(root, p, q):
    pass  # TODO: implement

def _run_tests():
    t = build_tree([6, 2, 8, 0, 4, 7, 9, None, None, 3, 5])
    assert lowest_common_ancestor(t, find_node(t, 2), find_node(t, 8)).val == 6
    assert lowest_common_ancestor(t, find_node(t, 2), find_node(t, 4)).val == 2
    assert lowest_common_ancestor(t, find_node(t, 0), find_node(t, 5)).val == 2
    t2 = build_tree([4, 2, 6, 1, 3, 5, 7])
    assert lowest_common_ancestor(t2, find_node(t2, 5), find_node(t2, 7)).val == 6
    # --- large-input timing ---
    import time as _t
    def _make_tree(n):
        if not n: return None
        nodes = [TreeNode(i) for i in range(n)]
        for i in range(n):
            if 2*i+1 < n: nodes[i].left = nodes[2*i+1]
            if 2*i+2 < n: nodes[i].right = nodes[2*i+2]
        return nodes[0]
    _root = _make_tree(1000)
    _p = _root.left
    _q = _root.right
    _t0 = _t.perf_counter()
    lowest_common_ancestor(_root, _p, _q)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf lowest_common_ancestor on 1000-node tree: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
