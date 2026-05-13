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

def rob(root):
    def dfs(node):
        if not node:                               # L1: O(1) base case
            return (0, 0)                          # L2: (rob, skip) pair
        left = dfs(node.left)                      # L3: O(1) dispatch, returns pair
        right = dfs(node.right)                    # L4: O(1) dispatch, returns pair
        rob_this = node.val + left[1] + right[1]   # L5: O(1), left[1]=skip_left
        skip_this = max(left) + max(right)         # L6: O(1), best of each child
        return (rob_this, skip_this)               # L7: O(1) return pair

    return max(dfs(root))                          # L8: O(1) take best at root

assert rob(build_tree([3, 2, 3, None, 3, None, 1])) == 7
assert rob(build_tree([3, 4, 5, 1, 3, None, 1])) == 10
assert rob(build_tree([5])) == 5
assert rob(build_tree([1, 2])) == 2
print("all tests pass")
