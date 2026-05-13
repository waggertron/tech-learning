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

function goodNodes(root: TreeNode | null): number {
    function dfs(node: TreeNode | null, maxSoFar: number): number {
        if (!node) return 0;
        const good = node.val >= maxSoFar ? 1 : 0;       // L1: O(1) check
        const newMax = Math.max(maxSoFar, node.val);      // L2: O(1) update
        return good + dfs(node.left, newMax) + dfs(node.right, newMax);  // L3: recurse
    }
    return dfs(root, -Infinity);
}

assert(goodNodes(buildTree([3, 1, 4, 3, null, 1, 5])) === 4);
assert(goodNodes(buildTree([3, 3, null, 4, 2])) === 3);
assert(goodNodes(buildTree([1])) === 1);
assert(goodNodes(buildTree([5, 4, 6, 3, null, null, 7])) === 3);
console.log("all tests pass");
