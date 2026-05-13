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

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    // TODO: implement
    return false;
}

function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isSubtree(buildTree([3, 4, 5, 1, 2]), buildTree([4, 1, 2])) === true);
    assert(isSubtree(buildTree([3, 4, 5, 1, 2, null, null, null, null, 0]), buildTree([4, 1, 2])) === false);
    const t = buildTree([1, 2, 3]);
    assert(isSubtree(t, t) === true);
    assert(isSubtree(buildTree([1, 2, 3]), buildTree([2])) === true);
    assert(isSubtree(buildTree([1, 2, 3]), buildTree([4])) === false);
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
    const sub = makeTree(50);
    const t0 = performance.now();
    isSubtree(root, sub);
    console.log(`perf is_subtree (1000-node root, 50-node subtree): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
