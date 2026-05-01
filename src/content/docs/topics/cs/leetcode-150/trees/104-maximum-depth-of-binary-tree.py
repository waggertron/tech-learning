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

def max_depth(root):
    pass  # TODO: implement

def _run_tests():
    assert max_depth(build_tree([3, 9, 20, None, None, 15, 7])) == 3
    assert max_depth(build_tree([1, None, 2])) == 2
    assert max_depth(None) == 0
    assert max_depth(build_tree([1])) == 1
    t = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4))))
    assert max_depth(t) == 4
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
