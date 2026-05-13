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

function treeToList(root: TreeNode | null): (number | null)[] {
    if (!root) return [];
    const result: (number | null)[] = [];
    const q: (TreeNode | null)[] = [root];
    while (q.length) {
        const node = q.shift()!;
        if (node) {
            result.push(node.val);
            q.push(node.left);
            q.push(node.right);
        } else {
            result.push(null);
        }
    }
    while (result.length && result[result.length - 1] === null) result.pop();
    return result;
}

function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    function eq(a: (number | null)[], b: (number | null)[]): boolean {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    const t = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
    assert(eq(treeToList(t), [3, 9, 20, null, null, 15, 7]));
    const t2 = buildTree([-1], [-1]);
    assert(t2 !== null && t2.val === -1 && t2.left === null && t2.right === null);
    const t3 = buildTree([1, 2, 3], [3, 2, 1]);
    assert(eq(treeToList(t3), [1, 2, null, 3]));
    const t4 = buildTree([1, 2, 3], [1, 2, 3]);
    assert(eq(treeToList(t4), [1, null, 2, null, 3]));
    // perf
    const n = 100_000;
    const inorder: number[] = Array.from({ length: n }, (_, i) => i);
    const preorder: number[] = [];
    function genPre(lo: number, hi: number): void {
        if (lo > hi) return;
        const mid = Math.floor((lo + hi) / 2);
        preorder.push(inorder[mid]);
        genPre(lo, mid - 1);
        genPre(mid + 1, hi);
    }
    genPre(0, n - 1);
    const t0 = performance.now();
    buildTree(preorder, inorder);
    console.log(`perf build_tree from preorder/inorder with ${n} nodes: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
