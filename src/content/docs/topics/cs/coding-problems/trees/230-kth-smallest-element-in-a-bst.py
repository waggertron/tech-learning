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

def kth_smallest(root, k):
    pass  # TODO: implement

def _run_tests():
    assert kth_smallest(build_tree([3, 1, 4, None, 2]), 1) == 1
    assert kth_smallest(build_tree([5, 3, 6, 2, 4, None, None, 1]), 3) == 3
    assert kth_smallest(build_tree([1]), 1) == 1
    assert kth_smallest(build_tree([3, 1, 4, None, 2]), 4) == 4
    # --- large-input timing ---
    import time as _t
    # build a sorted right-chain BST of 1000 nodes
    _bst_nodes = [TreeNode(i) for i in range(1000)]
    for _i in range(999):
        _bst_nodes[_i].right = _bst_nodes[_i + 1]
    _bst_root = _bst_nodes[0]
    _t0 = _t.perf_counter()
    kth_smallest(_bst_root, 500)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf kth_smallest (k=500) on 1000-node BST chain: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
