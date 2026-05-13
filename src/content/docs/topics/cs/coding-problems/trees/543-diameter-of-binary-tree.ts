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

function diameterOfBinaryTree(root: TreeNode | null): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(diameterOfBinaryTree(buildTree([1, 2, 3, 4, 5])) === 3);
    assert(diameterOfBinaryTree(buildTree([1, 2])) === 1);
    assert(diameterOfBinaryTree(buildTree([1])) === 0);
    const t = new TreeNode(1, new TreeNode(2, new TreeNode(3, new TreeNode(4))));
    assert(diameterOfBinaryTree(t) === 3);
    const t2 = buildTree([1, 2, null, 3, 4]);
    assert(diameterOfBinaryTree(t2) === 2);
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
    const root = makeTree(1000);
    const t0 = performance.now();
    diameterOfBinaryTree(root);
    console.log(`perf diameter_of_binary_tree on 1000-node complete tree: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
