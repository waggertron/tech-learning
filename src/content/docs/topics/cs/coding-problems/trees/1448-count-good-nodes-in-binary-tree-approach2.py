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

def good_nodes(root: TreeNode | None) -> int:
    def dfs(node: TreeNode | None, max_so_far: float) -> int:
        if not node:
            return 0
        good = 1 if node.val >= max_so_far else 0    # L1: O(1) check
        new_max = max(max_so_far, node.val)           # L2: O(1) update
        return good + dfs(node.left, new_max) + dfs(node.right, new_max)  # L3: recurse
    return dfs(root, float('-inf'))

assert good_nodes(build_tree([3, 1, 4, 3, None, 1, 5])) == 4
assert good_nodes(build_tree([3, 3, None, 4, 2])) == 3
assert good_nodes(build_tree([1])) == 1
assert good_nodes(build_tree([5, 4, 6, 3, None, None, 7])) == 3
print("all tests pass")
