class TreeNode:

    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(vals):
    if not vals:
        return None
    from collections import deque
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

def tree_to_list(root):
    from collections import deque
    if not root:
        return []
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

class Codec:

    def serialize(self, root):
        pass  # TODO: implement

    def deserialize(self, data):
        pass  # TODO: implement

def _run_tests():
    codec = Codec()
    t = build_tree([1, 2, 3, None, None, 4, 5])
    assert tree_to_list(codec.deserialize(codec.serialize(t))) == [1, 2, 3, None, None, 4, 5]
    assert codec.deserialize(codec.serialize(None)) is None
    t2 = build_tree([42])
    assert codec.deserialize(codec.serialize(t2)).val == 42
    t3 = build_tree([1, 2, None, 3])
    assert tree_to_list(codec.deserialize(codec.serialize(t3))) == [1, 2, None, 3]
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
    _codec = Codec()
    _t0 = _t.perf_counter()
    _codec.deserialize(_codec.serialize(_root))
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf serialize+deserialize round-trip on 1000-node tree: {_ms:.1f}ms')
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
