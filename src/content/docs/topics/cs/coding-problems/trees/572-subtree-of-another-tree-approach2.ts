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

function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
    function serialize(node: TreeNode | null): string {
        if (!node) return '#';
        return `,${node.val},(${serialize(node.left)})(${serialize(node.right)})`;  // L1: O(n) build
    }
    return serialize(root).includes(serialize(subRoot));  // L2: substring search
}

assert(isSubtree(buildTree([3, 4, 5, 1, 2]), buildTree([4, 1, 2])) === true);
assert(isSubtree(buildTree([3, 4, 5, 1, 2, null, null, null, null, 0]), buildTree([4, 1, 2])) === false);
const t = buildTree([1, 2, 3]);
assert(isSubtree(t, t) === true);
assert(isSubtree(buildTree([1, 2, 3]), buildTree([2])) === true);
assert(isSubtree(buildTree([1, 2, 3]), buildTree([4])) === false);
console.log("all tests pass");
