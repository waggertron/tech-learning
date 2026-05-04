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

def is_valid_bst(root):
    pass  # TODO: implement

def _run_tests():
    assert is_valid_bst(build_tree([2, 1, 3])) == True
    assert is_valid_bst(build_tree([5, 1, 4, None, None, 3, 6])) == False
    assert is_valid_bst(build_tree([1])) == True
    assert is_valid_bst(None) == True
    assert is_valid_bst(build_tree([3, 1, 5, 0, 2, 4, 6])) == True
    assert is_valid_bst(build_tree([5, 4, 6, None, None, 3, 7])) == False
    # --- large-input timing ---
    import time as _t
    def _make_tree(n):
        if not n: return None
        nodes = [TreeNode(i) for i in range(n)]
        for i in range(n):
            if 2*i+1 < n: nodes[i].left = nodes[2*i+1]
            if 2*i+2 < n: nodes[i].right = nodes[2*i+2]
        return nodes[0]
    # build a sorted left-chain BST of 1000 nodes (valid BST)
    _bst_nodes = [TreeNode(i) for i in range(1000)]
    for _i in range(999):
        _bst_nodes[_i].right = _bst_nodes[_i + 1]
    _bst_root = _bst_nodes[0]
    _t0 = _t.perf_counter()
    is_valid_bst(_bst_root)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf validate_bst on 1000-node sorted BST: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
