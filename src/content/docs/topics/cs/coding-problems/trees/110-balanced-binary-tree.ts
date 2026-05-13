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

function isBalanced(root: TreeNode | null): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isBalanced(buildTree([3, 9, 20, null, null, 15, 7])) === true);
    assert(isBalanced(buildTree([1, 2, 2, 3, 3, null, null, 4, 4])) === false);
    assert(isBalanced(null) === true);
    assert(isBalanced(buildTree([1])) === true);
    const t = new TreeNode(1, new TreeNode(2, new TreeNode(3, new TreeNode(4))));
    assert(isBalanced(t) === false);
    // perf
    function makeTree(n: number): TreeNode | null {
        if (!n) return null;
        const nodes = Array.from({ length: n }, (_, i) => new TreeNode(i));
        for (let i = 0; i < n; i++) {
            if (2 * i + 1 < n) nodes[i].left = nodes[2 * i + 1];
            if (2 * i + 2 < n) nodes[i].right = nodes[2 * i + 2];
        }
        return nodes[0];
    }
    const root = makeTree(131_071);
    const t0 = performance.now();
    isBalanced(root);
    console.log(`perf is_balanced on 131071-node complete tree: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
