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

def is_balanced(root):
    pass  # TODO: implement

def _run_tests():
    assert is_balanced(build_tree([3, 9, 20, None, None, 15, 7])) == True
    assert is_balanced(build_tree([1, 2, 2, 3, 3, None, None, 4, 4])) == False
    assert is_balanced(None) == True
    assert is_balanced(build_tree([1])) == True
    t = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4))))
    assert is_balanced(t) == False
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
    is_balanced(_root)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf is_balanced on 1000-node complete tree: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
