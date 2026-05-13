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

def min_camera_cover(root):
    cameras = 0                                # L1: O(1) counter

    def dfs(node):
        nonlocal cameras
        if not node:                           # L2: null nodes are trivially covered
            return 2
        left = dfs(node.left)                  # L3: O(1) dispatch
        right = dfs(node.right)                # L4: O(1) dispatch
        if left == 0 or right == 0:            # L5: a child needs coverage
            cameras += 1                       # L6: O(1) place camera here
            return 1
        if left == 1 or right == 1:            # L7: a child has camera, covers this node
            return 2
        return 0                               # L8: children covered, but not this node

    if dfs(root) == 0:                         # L9: root uncovered, place one camera
        cameras += 1
    return cameras

assert min_camera_cover(build_tree([0, 0, None, 0, 0])) == 1
assert min_camera_cover(build_tree([0, 0, None, 0, None, 0, None, None, 0])) == 2
assert min_camera_cover(build_tree([0])) == 1
assert min_camera_cover(build_tree([0, 0])) == 1
print("all tests pass")
