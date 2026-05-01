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
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
