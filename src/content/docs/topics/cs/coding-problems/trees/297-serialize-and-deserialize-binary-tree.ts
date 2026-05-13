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

class Codec {
    serialize(root: TreeNode | null): string {
        // TODO: implement
        return '';
    }

    deserialize(data: string): TreeNode | null {
        // TODO: implement
        return null;
    }
}

function _runTests(): void {
    function eq(a: (number | null)[], b: (number | null)[]): boolean {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    const codec = new Codec();
    const t = buildTree([1, 2, 3, null, null, 4, 5]);
    assert(eq(treeToList(codec.deserialize(codec.serialize(t))), [1, 2, 3, null, null, 4, 5]));
    assert(codec.deserialize(codec.serialize(null)) === null);
    const t2 = buildTree([42]);
    assert(codec.deserialize(codec.serialize(t2))!.val === 42);
    const t3 = buildTree([1, 2, null, 3]);
    assert(eq(treeToList(codec.deserialize(codec.serialize(t3))), [1, 2, null, 3]));
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
    codec.deserialize(codec.serialize(root));
    console.log(`perf serialize+deserialize round-trip on 1000-node tree: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
