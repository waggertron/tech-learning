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

function maxPathSum(root: TreeNode | null): number {
    let best = -Infinity;

    function maxGain(node: TreeNode | null): number {
        if (!node) return 0;
        const left = Math.max(0, maxGain(node.left));          // L1: recurse left, O(1) dispatch
        const right = Math.max(0, maxGain(node.right));         // L2: recurse right, O(1) dispatch
        best = Math.max(best, node.val + left + right);         // L3: O(1) side-effect update
        return node.val + Math.max(left, right);                // L4: O(1) return
    }

    maxGain(root);
    return best;
}

assert(maxPathSum(buildTree([1, 2, 3])) === 6);
assert(maxPathSum(buildTree([-10, 9, 20, null, null, 15, 7])) === 42);
assert(maxPathSum(buildTree([1])) === 1);
assert(maxPathSum(buildTree([-3, -1, -2])) === -1);
assert(maxPathSum(buildTree([-1, 2, 3])) === 4);
console.log("all tests pass");
