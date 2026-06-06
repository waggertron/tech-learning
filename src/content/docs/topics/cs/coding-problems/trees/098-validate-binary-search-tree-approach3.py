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

def is_valid_bst(root: TreeNode | None) -> bool:
    def validate(node: TreeNode | None, low: float, high: float) -> bool:
        if not node:
            return True
        if not (low < node.val < high):  # L1: O(1) bounds check
            return False
        return (validate(node.left, low, node.val)     # L2: tighten high
                and validate(node.right, node.val, high))  # L3: tighten low
    return validate(root, float('-inf'), float('inf'))

assert is_valid_bst(build_tree([2, 1, 3])) == True
assert is_valid_bst(build_tree([5, 1, 4, None, None, 3, 6])) == False
assert is_valid_bst(build_tree([1])) == True
assert is_valid_bst(None) == True
assert is_valid_bst(build_tree([3, 1, 5, 0, 2, 4, 6])) == True
assert is_valid_bst(build_tree([5, 4, 6, None, None, 3, 7])) == False
print("all tests pass")
