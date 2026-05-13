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

function kthSmallest(root: TreeNode | null, k: number): number {
    // TODO: implement
    return -1;
}

function _runTests(): void {
    assert(kthSmallest(buildTree([3, 1, 4, null, 2]), 1) === 1);
    assert(kthSmallest(buildTree([5, 3, 6, 2, 4, null, null, 1]), 3) === 3);
    assert(kthSmallest(buildTree([1]), 1) === 1);
    assert(kthSmallest(buildTree([3, 1, 4, null, 2]), 4) === 4);
    // perf
    const bstNodes: TreeNode[] = Array.from({ length: 100_000 }, (_, i) => new TreeNode(i));
    for (let i = 0; i < 99_999; i++) bstNodes[i].right = bstNodes[i + 1];
    const t0 = performance.now();
    kthSmallest(bstNodes[0], 50_000);
    console.log(`perf kth_smallest (k=50000) on 100000-node BST chain: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
