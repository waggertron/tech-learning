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

def diameter_of_binary_tree(root):
    best = 0

    def height(node):
        nonlocal best
        if not node:
            return 0
        left = height(node.left)              # L1: recurse left
        right = height(node.right)            # L2: recurse right
        best = max(best, left + right)        # L3: O(1) update diameter
        return 1 + max(left, right)           # L4: O(1) return height to parent

    height(root)
    return best

assert diameter_of_binary_tree(build_tree([1, 2, 3, 4, 5])) == 3
assert diameter_of_binary_tree(build_tree([1, 2])) == 1
assert diameter_of_binary_tree(build_tree([1])) == 0
t = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4))))
assert diameter_of_binary_tree(t) == 3
t2 = build_tree([1, 2, None, 3, 4])
assert diameter_of_binary_tree(t2) == 2
print("all tests pass")
