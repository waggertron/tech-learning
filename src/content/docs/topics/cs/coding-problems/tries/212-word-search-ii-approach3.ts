function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class TrieNode {
    children: Map<string, TrieNode> = new Map();
    word: string | null = null;
}

function findWords(board: string[][], words: string[]): string[] {
    const root = new TrieNode();
    for (const w of words) {
        let node = root;
        for (const ch of w) {
            if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
            node = node.children.get(ch)!;
        }
        node.word = w;
    }

    const rows = board.length, cols = board[0].length;
    const found: string[] = [];

    function dfs(r: number, c: number, node: TrieNode): void {
        if (r < 0 || r >= rows || c < 0 || c >= cols) return;
        const ch = board[r][c];
        if (ch === '#' || !node.children.has(ch)) return;
        const nextNode = node.children.get(ch)!;
        if (nextNode.word !== null) { found.push(nextNode.word); nextNode.word = null; }
        board[r][c] = '#';
        dfs(r + 1, c, nextNode); dfs(r - 1, c, nextNode);
        dfs(r, c + 1, nextNode); dfs(r, c - 1, nextNode);
        board[r][c] = ch;
        // Dead-branch pruning
        if (nextNode.children.size === 0 && nextNode.word === null) {
            node.children.delete(ch);
        }
    }

    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            dfs(r, c, root);
    return found;
}

const board1 = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]];
const r1 = new Set(findWords(board1, ["oath","pea","eat","rain"]));
assert(r1.has("oath") && r1.has("eat") && r1.size === 2);
assert(JSON.stringify(findWords([["a"]], ["a"])) === JSON.stringify(["a"]));
assert(JSON.stringify(findWords([["a"]], ["b"])) === JSON.stringify([]));
const board2 = [["a","b"],["c","d"]];
const r2 = new Set(findWords(board2, ["ab","cd","abdc"]));
assert(r2.has("ab") && r2.has("cd") && r2.has("abdc") && r2.size === 3);
console.log("all tests pass");
