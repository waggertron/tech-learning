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

function treeToList(root: TreeNode | null): (number | null)[] {
    if (!root) return [];
    const result: (number | null)[] = [];
    const q: (TreeNode | null)[] = [root];
    while (q.length) {
        const node = q.shift()!;
        if (node) { result.push(node.val); q.push(node.left); q.push(node.right); }
        else result.push(null);
    }
    while (result.length && result[result.length - 1] === null) result.pop();
    return result;
}

function invertTree(root: TreeNode | null): TreeNode | null {
    if (!root) return null;
    const q: TreeNode[] = [root];   // L1: O(1) init
    while (q.length) {
        const node = q.shift()!;    // L2: O(1) dequeue
        [node.left, node.right] = [node.right, node.left];  // L3: O(1) swap
        if (node.left) q.push(node.left);    // L4: O(1) enqueue
        if (node.right) q.push(node.right);  // L5: O(1) enqueue
    }
    return root;
}

function eq(a: (number | null)[], b: (number | null)[]): boolean { return JSON.stringify(a) === JSON.stringify(b); }
assert(eq(treeToList(invertTree(buildTree([4, 2, 7, 1, 3, 6, 9]))), [4, 7, 2, 9, 6, 3, 1]));
assert(invertTree(null) === null);
assert(eq(treeToList(invertTree(buildTree([1]))), [1]));
console.log("all tests pass");
