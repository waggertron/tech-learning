function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class TrieNode {
    children: Map<string, TrieNode> = new Map();
    isEnd: boolean = false;
}

class WordDictionary {
    private root = new TrieNode();

    addWord(word: string): void {
        let node = this.root;
        for (const ch of word) {
            if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
            node = node.children.get(ch)!;
        }
        node.isEnd = true;
    }

    search(word: string): boolean {
        return this.dfs(0, this.root, word);
    }

    private dfs(i: number, node: TrieNode, word: string): boolean {
        if (i === word.length) return node.isEnd;
        const ch = word[i];
        if (ch === '.') {
            for (const child of node.children.values()) {
                if (this.dfs(i + 1, child, word)) return true;
            }
            return false;
        }
        if (!node.children.has(ch)) return false;
        return this.dfs(i + 1, node.children.get(ch)!, word);
    }
}

const wd = new WordDictionary();
wd.addWord("bad"); wd.addWord("dad"); wd.addWord("mad");
assert(wd.search("pad") === false);
assert(wd.search("bad") === true);
assert(wd.search(".ad") === true);
assert(wd.search("b..") === true);
assert(wd.search("...") === true);
assert(wd.search("....") === false);
console.log("all tests pass");
