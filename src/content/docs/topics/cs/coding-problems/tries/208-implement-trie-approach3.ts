function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class TrieNode {
    children: (TrieNode | null)[] = new Array(26).fill(null);
    isEnd: boolean = false;
}

class Trie {
    private root = new TrieNode();

    insert(word: string): void {
        let node = this.root;
        for (const ch of word) {
            const i = ch.charCodeAt(0) - 97;
            if (!node.children[i])
                node.children[i] = new TrieNode();
            node = node.children[i]!;
        }
        node.isEnd = true;
    }

    search(word: string): boolean {
        const node = this._walk(word);
        return node !== null && node.isEnd;
    }

    startsWith(prefix: string): boolean {
        return this._walk(prefix) !== null;
    }

    private _walk(s: string): TrieNode | null {
        let node = this.root;
        for (const ch of s) {
            const i = ch.charCodeAt(0) - 97;
            if (!node.children[i]) return null;
            node = node.children[i]!;
        }
        return node;
    }
}

const trie = new Trie();
trie.insert("apple");
assert(trie.search("apple") === true);
assert(trie.search("app") === false);
assert(trie.startsWith("app") === true);
trie.insert("app");
assert(trie.search("app") === true);
assert(trie.search("ap") === false);
assert(trie.startsWith("b") === false);
console.log("all tests pass");
