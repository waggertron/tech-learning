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
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
