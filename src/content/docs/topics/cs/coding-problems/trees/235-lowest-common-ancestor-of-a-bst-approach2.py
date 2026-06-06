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

def find_node(root: TreeNode | None, val: int) -> TreeNode | None:
    while root:
        if val == root.val: return root
        root = root.left if val < root.val else root.right
    return None

def lowest_common_ancestor(root: TreeNode | None, p: TreeNode, q: TreeNode) -> TreeNode | None:
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left          # L1: move left
        elif p.val > root.val and q.val > root.val:
            root = root.right         # L2: move right
        else:
            return root               # L3: found split
    return None

t = build_tree([6, 2, 8, 0, 4, 7, 9, None, None, 3, 5])
assert lowest_common_ancestor(t, find_node(t, 2), find_node(t, 8)).val == 6
assert lowest_common_ancestor(t, find_node(t, 2), find_node(t, 4)).val == 2
assert lowest_common_ancestor(t, find_node(t, 0), find_node(t, 5)).val == 2
t2 = build_tree([4, 2, 6, 1, 3, 5, 7])
assert lowest_common_ancestor(t2, find_node(t2, 5), find_node(t2, 7)).val == 6
print("all tests pass")
