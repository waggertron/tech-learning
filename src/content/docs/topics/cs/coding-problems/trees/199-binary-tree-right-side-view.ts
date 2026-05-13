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

function rightSideView(root: TreeNode | null): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    function eq(a: number[], b: number[]): boolean {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    assert(eq(rightSideView(buildTree([1, 2, 3, null, 5, null, 4])), [1, 3, 4]));
    assert(eq(rightSideView(buildTree([1, null, 3])), [1, 3]));
    assert(eq(rightSideView(null), []));
    assert(eq(rightSideView(buildTree([1])), [1]));
    const t = new TreeNode(1, new TreeNode(2, new TreeNode(3)));
    assert(eq(rightSideView(t), [1, 2, 3]));
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
    rightSideView(root);
    console.log(`perf right_side_view on 131071-node complete tree: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
