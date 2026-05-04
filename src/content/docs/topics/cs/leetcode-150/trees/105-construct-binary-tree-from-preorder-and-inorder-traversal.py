class TreeNode:

    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(preorder, inorder):
    pass  # TODO: implement

def tree_to_list(root):
    """Level-order serialize for comparison."""
    if not root:
        return []
    from collections import deque
    result, q = ([], deque([root]))
    while q:
        node = q.popleft()
        if node:
            result.append(node.val)
            q.append(node.left)
            q.append(node.right)
        else:
            result.append(None)
    while result and result[-1] is None:
        result.pop()
    return result

def _run_tests():
    t = build_tree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])
    assert tree_to_list(t) == [3, 9, 20, None, None, 15, 7]
    t2 = build_tree([-1], [-1])
    assert t2.val == -1
    assert t2.left is None and t2.right is None
    t3 = build_tree([1, 2, 3], [3, 2, 1])
    assert tree_to_list(t3) == [1, 2, None, 3]
    t4 = build_tree([1, 2, 3], [1, 2, 3])
    assert tree_to_list(t4) == [1, None, 2, None, 3]
    # --- large-input timing ---
    import time as _t
    _n = 1000
    _inorder = list(range(_n))
    _preorder = []
    # build preorder for a balanced complete tree over sorted inorder
    def _gen_pre(lo, hi):
        if lo > hi: return
        mid = (lo + hi) // 2
        _preorder.append(_inorder[mid])
        _gen_pre(lo, mid - 1)
        _gen_pre(mid + 1, hi)
    _gen_pre(0, _n - 1)
    _t0 = _t.perf_counter()
    build_tree(_preorder, _inorder)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf build_tree from preorder/inorder with {_n} nodes: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
