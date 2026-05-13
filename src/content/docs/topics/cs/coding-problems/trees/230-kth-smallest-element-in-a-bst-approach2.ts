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

function kthSmallest(root: TreeNode | null, k: number): number {
    let count = 0;
    let result: number | null = null;

    function inorder(node: TreeNode | null): void {
        if (!node || result !== null) return;     // L1: base / already found
        inorder(node.left);                       // L2: recurse left
        count++;                                  // L3: O(1) increment
        if (count === k) { result = node.val; return; }  // L4: O(1) record answer
        inorder(node.right);                      // L5: recurse right
    }

    inorder(root);
    return result!;
}

assert(kthSmallest(buildTree([3, 1, 4, null, 2]), 1) === 1);
assert(kthSmallest(buildTree([5, 3, 6, 2, 4, null, null, 1]), 3) === 3);
assert(kthSmallest(buildTree([1]), 1) === 1);
assert(kthSmallest(buildTree([3, 1, 4, null, 2]), 4) === 4);
console.log("all tests pass");
