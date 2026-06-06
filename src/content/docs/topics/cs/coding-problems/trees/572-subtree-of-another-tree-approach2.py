from __future__ import annotations


class TreeNode:
    def __init__(self, val: int = 0, left: TreeNode | None = None, right: TreeNode | None = None) -> None:
        self.val = val
        self.left = left
        self.right = right

def build_tree(vals: list[int | None]) -> TreeNode | None:
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

def is_subtree(root: TreeNode | None, subRoot: TreeNode | None) -> bool:
    def serialize(node: TreeNode | None) -> str:
        if not node:
            return "#"
        return f",{node.val},({serialize(node.left)})({serialize(node.right)})"  # L1: O(n) build
    return serialize(subRoot) in serialize(root)  # L2: substring search

assert is_subtree(build_tree([3, 4, 5, 1, 2]), build_tree([4, 1, 2])) == True
assert is_subtree(build_tree([3, 4, 5, 1, 2, None, None, None, None, 0]), build_tree([4, 1, 2])) == False
t = build_tree([1, 2, 3])
assert is_subtree(t, t) == True
assert is_subtree(build_tree([1, 2, 3]), build_tree([2])) == True
assert is_subtree(build_tree([1, 2, 3]), build_tree([4])) == False
print("all tests pass")
