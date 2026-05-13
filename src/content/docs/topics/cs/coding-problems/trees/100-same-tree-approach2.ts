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

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    const queue: [TreeNode | null, TreeNode | null][] = [[p, q]];  // L1: O(1) init
    while (queue.length) {
        const [a, b] = queue.shift()!;                              // L2: O(1) dequeue
        if (!a && !b) continue;                                     // L3: both null, OK
        if (!a || !b || a.val !== b.val) return false;              // L4: O(1) check
        queue.push([a.left, b.left]);                               // L5: O(1) enqueue
        queue.push([a.right, b.right]);                             // L6: O(1) enqueue
    }
    return true;
}

assert(isSameTree(buildTree([1, 2, 3]), buildTree([1, 2, 3])) === true);
assert(isSameTree(buildTree([1, 2]), buildTree([1, null, 2])) === false);
assert(isSameTree(null, null) === true);
assert(isSameTree(buildTree([1]), null) === false);
assert(isSameTree(buildTree([1]), buildTree([1])) === true);
assert(isSameTree(buildTree([1, 2, 3]), buildTree([1, 2, 4])) === false);
console.log("all tests pass");
