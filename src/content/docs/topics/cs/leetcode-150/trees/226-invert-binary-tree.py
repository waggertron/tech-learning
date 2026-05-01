from collections import deque

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

def tree_to_list(root):
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

def invert_tree(root):
    pass  # TODO: implement

def _run_tests():
    assert tree_to_list(invert_tree(build_tree([4, 2, 7, 1, 3, 6, 9]))) == [4, 7, 2, 9, 6, 3, 1]
    assert invert_tree(None) is None
    assert tree_to_list(invert_tree(build_tree([1]))) == [1]
    t = build_tree([1, 2, 3])
    assert tree_to_list(invert_tree(invert_tree(t))) == [1, 2, 3]
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
