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
    function validate(node: TreeNode | null, low: number, high: number): boolean {
        if (!node) return true;
        if (!(low < node.val && node.val < high)) return false;  // L1: O(1) bounds check
        return (validate(node.left, low, node.val)               // L2: tighten high
             && validate(node.right, node.val, high));           // L3: tighten low
    }
    return validate(root, -Infinity, Infinity);
}

assert(isValidBST(buildTree([2, 1, 3])) === true);
assert(isValidBST(buildTree([5, 1, 4, null, null, 3, 6])) === false);
assert(isValidBST(buildTree([1])) === true);
assert(isValidBST(null) === true);
assert(isValidBST(buildTree([3, 1, 5, 0, 2, 4, 6])) === true);
assert(isValidBST(buildTree([5, 4, 6, null, null, 3, 7])) === false);
console.log("all tests pass");
