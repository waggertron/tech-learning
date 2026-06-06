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

def level_order(root: TreeNode | None) -> list[list[int]]:
    result: list[list[int]] = []
    def dfs(node: TreeNode | None, depth: int) -> None:
        if not node:
            return
        if depth == len(result):       # L1: first visit at this depth
            result.append([])
        result[depth].append(node.val) # L2: O(1) append
        dfs(node.left, depth + 1)      # L3: recurse left
        dfs(node.right, depth + 1)     # L4: recurse right
    dfs(root, 0)
    return result

assert level_order(build_tree([3, 9, 20, None, None, 15, 7])) == [[3], [9, 20], [15, 7]]
assert level_order(build_tree([1])) == [[1]]
assert level_order(None) == []
t = TreeNode(1, TreeNode(2, TreeNode(3)))
assert level_order(t) == [[1], [2], [3]]
print("all tests pass")
