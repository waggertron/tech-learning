from __future__ import annotations


class TreeNode:
    def __init__(self, val: int = 0, left: TreeNode | None = None, right: TreeNode | None = None) -> None:
        self.val = val
        self.left = left
        self.right = right

def build_tree(preorder: list[int], inorder: list[int]) -> TreeNode | None:
    inorder_idx = {v: i for i, v in enumerate(inorder)}  # L1: O(n) build map
    pre_i = [0]

    def rec(in_l: int, in_r: int) -> TreeNode | None:
        if in_l > in_r:
            return None
        root_val = preorder[pre_i[0]]           # L2: O(1) index into preorder
        pre_i[0] += 1                           # L3: O(1) advance pointer
        root = TreeNode(root_val)
        mid = inorder_idx[root_val]             # L4: O(1) hash lookup
        root.left = rec(in_l, mid - 1)          # L5: recurse left subtree
        root.right = rec(mid + 1, in_r)         # L6: recurse right subtree
        return root

    return rec(0, len(inorder) - 1)

def tree_to_list(root: TreeNode | None) -> list[int | None]:
    if not root: return []
    from collections import deque
    result, q = [], deque([root])
    while q:
        node = q.popleft()
        if node:
            result.append(node.val)
            q.append(node.left)
            q.append(node.right)
        else:
            result.append(None)
    while result and result[-1] is None:
        result.pop()
    return result

t = build_tree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])
assert tree_to_list(t) == [3, 9, 20, None, None, 15, 7]
t2 = build_tree([-1], [-1])
assert t2.val == -1 and t2.left is None and t2.right is None
t3 = build_tree([1, 2, 3], [3, 2, 1])
assert tree_to_list(t3) == [1, 2, None, 3]
t4 = build_tree([1, 2, 3], [1, 2, 3])
assert tree_to_list(t4) == [1, None, 2, None, 3]
print("all tests pass")
