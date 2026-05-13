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
        if (i < vals.length && vals[i] !== null) {
            node.left = new TreeNode(vals[i] as number);
            q.push(node.left);
        }
        i++;
        if (i < vals.length && vals[i] !== null) {
            node.right = new TreeNode(vals[i] as number);
            q.push(node.right);
        }
        i++;
    }
    return root;
}

function isValidBST(root: TreeNode | null): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isValidBST(buildTree([2, 1, 3])) === true);
    assert(isValidBST(buildTree([5, 1, 4, null, null, 3, 6])) === false);
    assert(isValidBST(buildTree([1])) === true);
    assert(isValidBST(null) === true);
    assert(isValidBST(buildTree([3, 1, 5, 0, 2, 4, 6])) === true);
    assert(isValidBST(buildTree([5, 4, 6, null, null, 3, 7])) === false);
    // perf
    const bstNodes: TreeNode[] = Array.from({ length: 100_000 }, (_, i) => new TreeNode(i));
    for (let i = 0; i < 99_999; i++) bstNodes[i].right = bstNodes[i + 1];
    const t0 = performance.now();
    isValidBST(bstNodes[0]);
    console.log(`perf validate_bst on 100000-node sorted BST: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
