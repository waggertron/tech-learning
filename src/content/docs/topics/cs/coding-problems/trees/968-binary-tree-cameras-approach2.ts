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

function minCameraCover(root: TreeNode | null): number {
    let cameras = 0;                                        // L1: O(1) counter

    function dfs(node: TreeNode | null): number {
        if (!node) return 2;                               // L2: null nodes are trivially covered
        const left = dfs(node.left);                       // L3: O(1) dispatch
        const right = dfs(node.right);                     // L4: O(1) dispatch
        if (left === 0 || right === 0) { cameras++; return 1; }  // L5/L6: place camera
        if (left === 1 || right === 1) return 2;          // L7: a child has camera
        return 0;                                          // L8: children covered, not this node
    }

    if (dfs(root) === 0) cameras++;                        // L9: root uncovered
    return cameras;
}

assert(minCameraCover(buildTree([0, 0, null, 0, 0])) === 1);
assert(minCameraCover(buildTree([0, 0, null, 0, null, 0, null, null, 0])) === 2);
assert(minCameraCover(buildTree([0])) === 1);
assert(minCameraCover(buildTree([0, 0])) === 1);
console.log("all tests pass");
