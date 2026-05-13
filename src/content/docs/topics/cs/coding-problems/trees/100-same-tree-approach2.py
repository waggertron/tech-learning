from collections import deque

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

def is_same_tree(p, q):
    q_pairs = deque([(p, q)])           # L1: O(1) init
    while q_pairs:
        a, b = q_pairs.popleft()        # L2: O(1) dequeue
        if not a and not b:
            continue                    # L3: both null, OK
        if not a or not b or a.val != b.val:
            return False                # L4: O(1) check
        q_pairs.append((a.left, b.left))    # L5: O(1) enqueue
        q_pairs.append((a.right, b.right))  # L6: O(1) enqueue
    return True

assert is_same_tree(build_tree([1, 2, 3]), build_tree([1, 2, 3])) == True
assert is_same_tree(build_tree([1, 2]), build_tree([1, None, 2])) == False
assert is_same_tree(None, None) == True
assert is_same_tree(build_tree([1]), None) == False
assert is_same_tree(build_tree([1]), build_tree([1])) == True
assert is_same_tree(build_tree([1, 2, 3]), build_tree([1, 2, 4])) == False
print("all tests pass")
