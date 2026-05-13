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

function levelOrder(root: TreeNode | null): number[][] {
    const result: number[][] = [];
    function dfs(node: TreeNode | null, depth: number): void {
        if (!node) return;
        if (depth === result.length) result.push([]);  // L1: first visit at this depth
        result[depth].push(node.val);                  // L2: O(1) append
        dfs(node.left, depth + 1);                     // L3: recurse left
        dfs(node.right, depth + 1);                    // L4: recurse right
    }
    dfs(root, 0);
    return result;
}

function eq(a: number[][], b: number[][]): boolean { return JSON.stringify(a) === JSON.stringify(b); }
assert(eq(levelOrder(buildTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]]));
assert(eq(levelOrder(buildTree([1])), [[1]]));
assert(eq(levelOrder(null), []));
const t = new TreeNode(1, new TreeNode(2, new TreeNode(3)));
assert(eq(levelOrder(t), [[1], [2], [3]]));
console.log("all tests pass");
