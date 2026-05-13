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

function rob(root: TreeNode | null): number {
    function dfs(node: TreeNode | null): [number, number] {
        if (!node) return [0, 0];                              // L1/L2: base case (rob, skip) pair
        const left = dfs(node.left);                          // L3: O(1) dispatch, returns pair
        const right = dfs(node.right);                        // L4: O(1) dispatch, returns pair
        const robThis = node.val + left[1] + right[1];        // L5: O(1), left[1]=skip_left
        const skipThis = Math.max(...left) + Math.max(...right);  // L6: O(1), best of each child
        return [robThis, skipThis];                            // L7: O(1) return pair
    }
    return Math.max(...dfs(root));                            // L8: O(1) take best at root
}

assert(rob(buildTree([3, 2, 3, null, 3, null, 1])) === 7);
assert(rob(buildTree([3, 4, 5, 1, 3, null, 1])) === 10);
assert(rob(buildTree([5])) === 5);
assert(rob(buildTree([1, 2])) === 2);
console.log("all tests pass");
