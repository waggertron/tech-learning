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

def right_side_view(root):
    result = []
    def dfs(node, depth):
        if not node:
            return
        if depth == len(result):
            result.append(node.val)      # L1: O(1) first visit at this depth
        dfs(node.right, depth + 1)       # L2: recurse right first
        dfs(node.left, depth + 1)        # L3: recurse left second
    dfs(root, 0)
    return result

assert right_side_view(build_tree([1, 2, 3, None, 5, None, 4])) == [1, 3, 4]
assert right_side_view(build_tree([1, None, 3])) == [1, 3]
assert right_side_view(None) == []
assert right_side_view(build_tree([1])) == [1]
t = TreeNode(1, TreeNode(2, TreeNode(3)))
assert right_side_view(t) == [1, 2, 3]
print("all tests pass")
