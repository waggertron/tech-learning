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

function isBalanced(root: TreeNode | null): boolean {
    function height(node: TreeNode | null): number {
        if (!node) return 0;
        const lh = height(node.left);       // L1: recurse left
        if (lh === -1) return -1;           // L2: propagate failure up
        const rh = height(node.right);      // L3: recurse right
        if (rh === -1) return -1;           // L4: propagate failure up
        if (Math.abs(lh - rh) > 1) return -1;  // L5: O(1) balance check
        return 1 + Math.max(lh, rh);       // L6: O(1) return height
    }
    return height(root) !== -1;
}

assert(isBalanced(buildTree([3, 9, 20, null, null, 15, 7])) === true);
assert(isBalanced(buildTree([1, 2, 2, 3, 3, null, null, 4, 4])) === false);
assert(isBalanced(null) === true);
assert(isBalanced(buildTree([1])) === true);
const t = new TreeNode(1, new TreeNode(2, new TreeNode(3, new TreeNode(4))));
assert(isBalanced(t) === false);
console.log("all tests pass");
