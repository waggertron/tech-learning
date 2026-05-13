function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val: number = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
        this.val = val; this.left = left; this.right = right;
    }
}

function buildTree(vals: (number | null)[]): TreeNode | null {
    if (!vals.length) return null;
    const root = new TreeNode(vals[0] as number);
    const q: TreeNode[] = [root];
    let i = 1;
    while (q.length && i < vals.length) {
        const node = q.shift()!;
        if (i < vals.length && vals[i] !== null) { node.left = new TreeNode(vals[i] as number); q.push(node.left); }
        i++;
        if (i < vals.length && vals[i] !== null) { node.right = new TreeNode(vals[i] as number); q.push(node.right); }
        i++;
    }
    return root;
}

function isValidBST(root: TreeNode | null): boolean {
    let prev = -Infinity;

    function inorder(node: TreeNode | null): boolean {
        if (!node) return true;
        if (!inorder(node.left)) return false;   // L2: recurse left, O(h) stack depth
        if (node.val <= prev) return false;       // L3: O(1) monotonicity check
        prev = node.val;                          // L4: O(1) update
        return inorder(node.right);              // L5: recurse right
    }

    return inorder(root);
}

assert(isValidBST(buildTree([2, 1, 3])) === true);
assert(isValidBST(buildTree([5, 1, 4, null, null, 3, 6])) === false);
assert(isValidBST(buildTree([1])) === true);
assert(isValidBST(null) === true);
assert(isValidBST(buildTree([3, 1, 5, 0, 2, 4, 6])) === true);
assert(isValidBST(buildTree([5, 4, 6, null, null, 3, 7])) === false);
console.log("all tests pass");
