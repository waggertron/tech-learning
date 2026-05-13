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

function findNode(root: TreeNode | null, val: number): TreeNode | null {
    while (root) {
        if (val === root.val) return root;
        root = val < root.val ? root.left : root.right;
    }
    return null;
}

function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    const t = buildTree([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5])!;
    assert(lowestCommonAncestor(t, findNode(t, 2)!, findNode(t, 8)!)!.val === 6);
    assert(lowestCommonAncestor(t, findNode(t, 2)!, findNode(t, 4)!)!.val === 2);
    assert(lowestCommonAncestor(t, findNode(t, 0)!, findNode(t, 5)!)!.val === 2);
    const t2 = buildTree([4, 2, 6, 1, 3, 5, 7])!;
    assert(lowestCommonAncestor(t2, findNode(t2, 5)!, findNode(t2, 7)!)!.val === 6);
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
    const root = makeTree(1000)!;
    const t0 = performance.now();
    lowestCommonAncestor(root, root.left!, root.right!);
    console.log(`perf lowest_common_ancestor on 1000-node tree: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
