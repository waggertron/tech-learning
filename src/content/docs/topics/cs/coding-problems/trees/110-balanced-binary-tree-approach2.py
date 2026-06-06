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

def is_balanced(root: TreeNode | None) -> bool:
    def height(node: TreeNode | None) -> int:
        if not node:
            return 0
        lh = height(node.left)            # L1: recurse left
        if lh == -1:
            return -1                     # L2: propagate failure up
        rh = height(node.right)           # L3: recurse right
        if rh == -1:
            return -1                     # L4: propagate failure up
        if abs(lh - rh) > 1:
            return -1                     # L5: O(1) balance check
        return 1 + max(lh, rh)           # L6: O(1) return height

    return height(root) != -1

assert is_balanced(build_tree([3, 9, 20, None, None, 15, 7])) == True
assert is_balanced(build_tree([1, 2, 2, 3, 3, None, None, 4, 4])) == False
assert is_balanced(None) == True
assert is_balanced(build_tree([1])) == True
t = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4))))
assert is_balanced(t) == False
print("all tests pass")
