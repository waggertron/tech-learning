from __future__ import annotations
from collections import deque


class TreeNode:
    def __init__(self, val: int = 0, left: TreeNode | None = None, right: TreeNode | None = None):
        self.val = val
        self.left = left
        self.right = right


def build_tree(values: list[int | None]) -> TreeNode | None:
    if not values or values[0] is None:
        return None
    root = TreeNode(values[0])
    queue = deque([root])
    index = 1
    while queue and index < len(values):
        node = queue.popleft()
        for side in ("left", "right"):
            if index == len(values):
                break
            value = values[index]
            index += 1
            if value is not None:
                child = TreeNode(value)
                setattr(node, side, child)
                queue.append(child)
    return root


def minimum_difference(root: TreeNode) -> int:
    values = []

    def inorder(node):
        if node is None:
            return
        inorder(node.left)
        values.append(node.val)
        inorder(node.right)

    inorder(root)
    best = float("inf")
    for i in range(1, len(values)):
        best = min(best, values[i] - values[i - 1])
    return best


if __name__ == "__main__":
    for values, expected in [
        ([4, 2, 6, 1, 3], 1),
        ([1, 0, 48, None, None, 12, 49], 1),
        ([10, 1, None, None, 9], 1),
        ([0, None, 10], 10),
        ([10, 0], 10),
        ([8, 3, 20, 1, 6, 15, 30], 2),
    ]:
        assert minimum_difference(build_tree(values)) == expected
    print("Minimum-difference examples and edge cases passed.")
