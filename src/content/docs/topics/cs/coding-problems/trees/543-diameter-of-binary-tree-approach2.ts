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

function diameterOfBinaryTree(root: TreeNode | null): number {
    let best = 0;

    function height(node: TreeNode | null): number {
        if (!node) return 0;
        const left = height(node.left);              // L1: recurse left
        const right = height(node.right);            // L2: recurse right
        best = Math.max(best, left + right);         // L3: O(1) update diameter
        return 1 + Math.max(left, right);            // L4: O(1) return height to parent
    }

    height(root);
    return best;
}

assert(diameterOfBinaryTree(buildTree([1, 2, 3, 4, 5])) === 3);
assert(diameterOfBinaryTree(buildTree([1, 2])) === 1);
assert(diameterOfBinaryTree(buildTree([1])) === 0);
const t = new TreeNode(1, new TreeNode(2, new TreeNode(3, new TreeNode(4))));
assert(diameterOfBinaryTree(t) === 3);
const t2 = buildTree([1, 2, null, 3, 4]);
assert(diameterOfBinaryTree(t2) === 2);
console.log("all tests pass");
