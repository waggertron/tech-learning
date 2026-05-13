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

function rightSideView(root: TreeNode | null): number[] {
    const result: number[] = [];
    function dfs(node: TreeNode | null, depth: number): void {
        if (!node) return;
        if (depth === result.length) result.push(node.val);  // L1: O(1) first visit
        dfs(node.right, depth + 1);                          // L2: recurse right first
        dfs(node.left, depth + 1);                           // L3: recurse left second
    }
    dfs(root, 0);
    return result;
}

function eq(a: number[], b: number[]): boolean { return JSON.stringify(a) === JSON.stringify(b); }
assert(eq(rightSideView(buildTree([1, 2, 3, null, 5, null, 4])), [1, 3, 4]));
assert(eq(rightSideView(buildTree([1, null, 3])), [1, 3]));
assert(eq(rightSideView(null), []));
assert(eq(rightSideView(buildTree([1])), [1]));
const t = new TreeNode(1, new TreeNode(2, new TreeNode(3)));
assert(eq(rightSideView(t), [1, 2, 3]));
console.log("all tests pass");
