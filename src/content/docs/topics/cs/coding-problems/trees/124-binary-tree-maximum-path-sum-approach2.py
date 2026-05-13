class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(vals):
    if not vals: return None
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

def max_path_sum(root):
    best = float('-inf')

    def max_gain(node):
        nonlocal best
        if not node:
            return 0
        left = max(0, max_gain(node.left))          # L1: recurse left, O(1) dispatch
        right = max(0, max_gain(node.right))         # L2: recurse right, O(1) dispatch
        best = max(best, node.val + left + right)    # L3: O(1) side-effect update
        return node.val + max(left, right)           # L4: O(1) return

    max_gain(root)
    return best

assert max_path_sum(build_tree([1, 2, 3])) == 6
assert max_path_sum(build_tree([-10, 9, 20, None, None, 15, 7])) == 42
assert max_path_sum(build_tree([1])) == 1
assert max_path_sum(build_tree([-3, -1, -2])) == -1
assert max_path_sum(build_tree([-1, 2, 3])) == 4
print("all tests pass")
