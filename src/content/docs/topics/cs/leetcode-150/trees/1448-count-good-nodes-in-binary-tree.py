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

def good_nodes(root):
    pass  # TODO: implement

def _run_tests():
    assert good_nodes(build_tree([3, 1, 4, 3, None, 1, 5])) == 4
    assert good_nodes(build_tree([3, 3, None, 4, 2])) == 3
    assert good_nodes(build_tree([1])) == 1
    assert good_nodes(build_tree([5, 4, 6, 3, None, None, 7])) == 3
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
