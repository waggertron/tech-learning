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

def right_side_view(root):
    pass  # TODO: implement

def _run_tests():
    assert right_side_view(build_tree([1, 2, 3, None, 5, None, 4])) == [1, 3, 4]
    assert right_side_view(build_tree([1, None, 3])) == [1, 3]
    assert right_side_view(None) == []
    assert right_side_view(build_tree([1])) == [1]
    t = TreeNode(1, TreeNode(2, TreeNode(3)))
    assert right_side_view(t) == [1, 2, 3]
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
    _t0 = _t.perf_counter()
    right_side_view(_root)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf right_side_view on 1000-node complete tree: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
