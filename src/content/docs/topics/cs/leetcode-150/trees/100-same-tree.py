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

def is_same_tree(p, q):
    pass  # TODO: implement

def _run_tests():
    assert is_same_tree(build_tree([1, 2, 3]), build_tree([1, 2, 3])) == True
    assert is_same_tree(build_tree([1, 2]), build_tree([1, None, 2])) == False
    assert is_same_tree(None, None) == True
    assert is_same_tree(build_tree([1]), None) == False
    assert is_same_tree(build_tree([1]), build_tree([1])) == True
    assert is_same_tree(build_tree([1, 2, 3]), build_tree([1, 2, 4])) == False
    # --- large-input timing ---
    import time as _t
    def _make_tree(n):
        if not n: return None
        nodes = [TreeNode(i) for i in range(n)]
        for i in range(n):
            if 2*i+1 < n: nodes[i].left = nodes[2*i+1]
            if 2*i+2 < n: nodes[i].right = nodes[2*i+2]
        return nodes[0]
    _root_a = _make_tree(1000)
    _root_b = _make_tree(1000)
    _t0 = _t.perf_counter()
    is_same_tree(_root_a, _root_b)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf is_same_tree on two 1000-node trees: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
