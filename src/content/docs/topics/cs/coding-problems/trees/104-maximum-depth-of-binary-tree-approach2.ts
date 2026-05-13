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

function maxDepth(root: TreeNode | null): number {
    if (!root) return 0;
    const q: TreeNode[] = [root];  // L1: O(1) init
    let depth = 0;
    while (q.length) {
        depth++;                              // L2: O(1) increment per level
        const levelSize = q.length;
        for (let i = 0; i < levelSize; i++) {
            const node = q.shift()!;         // L3: O(1) dequeue
            if (node.left) q.push(node.left);    // L4: O(1) enqueue
            if (node.right) q.push(node.right);  // L5: O(1) enqueue
        }
    }
    return depth;
}

assert(maxDepth(buildTree([3, 9, 20, null, null, 15, 7])) === 3);
assert(maxDepth(buildTree([1, null, 2])) === 2);
assert(maxDepth(null) === 0);
assert(maxDepth(buildTree([1])) === 1);
const t = new TreeNode(1, new TreeNode(2, new TreeNode(3, new TreeNode(4))));
assert(maxDepth(t) === 4);
console.log("all tests pass");
