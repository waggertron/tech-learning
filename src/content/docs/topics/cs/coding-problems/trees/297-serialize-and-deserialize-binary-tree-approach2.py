from __future__ import annotations


class TreeNode:
    def __init__(self, val: int = 0, left: TreeNode | None = None, right: TreeNode | None = None) -> None:
        self.val = val
        self.left = left
        self.right = right

def build_tree(vals: list[int | None]) -> TreeNode | None:
    if not vals: return None
    from collections import deque
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

def tree_to_list(root: TreeNode | None) -> list[int | None]:
    from collections import deque
    if not root: return []
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

class Codec:
    def serialize(self, root: TreeNode | None) -> str:
        parts: list[str] = []
        def rec(node: TreeNode | None) -> None:
            if not node:
                parts.append("#")             # L1: O(1) emit null
                return
            parts.append(str(node.val))       # L2: O(1) emit value
            rec(node.left)                    # L3: recurse left
            rec(node.right)                   # L4: recurse right
        rec(root)
        return ",".join(parts)                # L5: O(n) join

    def deserialize(self, data: str) -> TreeNode | None:
        tokens = iter(data.split(","))        # L6: O(n) split + iterator
        def rec() -> TreeNode | None:
            val = next(tokens)
            if val == "#":
                return None                   # L7: null marker
            node = TreeNode(int(val))
            node.left = rec()                 # L8: recurse left
            node.right = rec()                # L9: recurse right
            return node
        return rec()

codec = Codec()
t = build_tree([1, 2, 3, None, None, 4, 5])
assert tree_to_list(codec.deserialize(codec.serialize(t))) == [1, 2, 3, None, None, 4, 5]
assert codec.deserialize(codec.serialize(None)) is None
t2 = build_tree([42])
assert codec.deserialize(codec.serialize(t2)).val == 42
t3 = build_tree([1, 2, None, 3])
assert tree_to_list(codec.deserialize(codec.serialize(t3))) == [1, 2, None, 3]
print("all tests pass")
