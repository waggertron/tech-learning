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

def min_camera_cover(root):
    pass  # TODO: implement

def _run_tests():
    assert min_camera_cover(build_tree([0, 0, None, 0, 0])) == 1
    assert min_camera_cover(build_tree([0, 0, None, 0, None, 0, None, None, 0])) == 2
    # single node must have a camera
    assert min_camera_cover(build_tree([0])) == 1
    # two nodes: camera on child covers parent; or camera on root covers child
    assert min_camera_cover(build_tree([0, 0])) == 1
    # three nodes in a line: camera on middle covers all
    assert min_camera_cover(build_tree([0, 0, None, 0])) == 1
    # --- large-input timing ---
    import time as _t
    def _make_tree(n):
        if not n:
            return None
        nodes = [TreeNode(0) for _ in range(n)]
        for i in range(n):
            if 2 * i + 1 < n:
                nodes[i].left = nodes[2 * i + 1]
            if 2 * i + 2 < n:
                nodes[i].right = nodes[2 * i + 2]
        return nodes[0]
    _root = _make_tree(1000)
    _t0 = _t.perf_counter()
    min_camera_cover(_root)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf min_camera_cover on 1000-node complete tree: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
