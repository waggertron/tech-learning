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

function treeToList(root: TreeNode | null): (number | null)[] {
    if (!root) return [];
    const result: (number | null)[] = [];
    const q: (TreeNode | null)[] = [root];
    while (q.length) {
        const node = q.shift()!;
        if (node) { result.push(node.val); q.push(node.left); q.push(node.right); }
        else result.push(null);
    }
    while (result.length && result[result.length - 1] === null) result.pop();
    return result;
}

class Codec {
    serialize(root: TreeNode | null): string {
        const parts: string[] = [];
        function rec(node: TreeNode | null): void {
            if (!node) { parts.push('#'); return; }  // L1: O(1) emit null
            parts.push(String(node.val));             // L2: O(1) emit value
            rec(node.left);                           // L3: recurse left
            rec(node.right);                          // L4: recurse right
        }
        rec(root);
        return parts.join(',');                       // L5: O(n) join
    }

    deserialize(data: string): TreeNode | null {
        if (!data) return null;
        const tokens = data.split(',')[Symbol.iterator]();  // L6: O(n) split + iterator
        function rec(): TreeNode | null {
            const { value } = tokens.next();
            if (value === '#') return null;            // L7: null marker
            const node = new TreeNode(Number(value));
            node.left = rec();                         // L8: recurse left
            node.right = rec();                        // L9: recurse right
            return node;
        }
        return rec();
    }
}

function eq(a: (number | null)[], b: (number | null)[]): boolean { return JSON.stringify(a) === JSON.stringify(b); }
const codec = new Codec();
const t = buildTree([1, 2, 3, null, null, 4, 5]);
assert(eq(treeToList(codec.deserialize(codec.serialize(t))), [1, 2, 3, null, null, 4, 5]));
assert(codec.deserialize(codec.serialize(null)) === null);
const t2 = buildTree([42]);
assert(codec.deserialize(codec.serialize(t2))!.val === 42);
const t3 = buildTree([1, 2, null, 3]);
assert(eq(treeToList(codec.deserialize(codec.serialize(t3))), [1, 2, null, 3]));
console.log("all tests pass");
