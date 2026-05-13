function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class TrieNode {
    children: Map<string, TrieNode> = new Map();
    isEnd: boolean = false;
}

class Trie {
    private root = new TrieNode();

    insert(word: string): void {
        // TODO: implement
    }

    search(word: string): boolean {
        // TODO: implement
        return false;
    }

    startsWith(prefix: string): boolean {
        // TODO: implement
        return false;
    }

    _walk(s: string): TrieNode | null {
        // TODO: implement
        return null;
    }
}

function _runTests(): void {
    const trie = new Trie();
    trie.insert('apple');
    assert(trie.search('apple') === true);
    assert(trie.search('app') === false);
    assert(trie.startsWith('app') === true);
    trie.insert('app');
    assert(trie.search('app') === true);
    assert(trie.search('ap') === false);
    assert(trie.startsWith('b') === false);
    // perf
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const words = Array.from({ length: 100_000 }, (_, i) =>
        Array.from({ length: 5 + (i % 6) }, (_, j) => chars[(i * 7 + j) % 26]).join('')
    );
    const bigTrie = new Trie();
    const t0 = performance.now();
    words.forEach(w => bigTrie.insert(w));
    words.forEach(w => bigTrie.search(w));
    console.log(`perf Trie insert+search 100000 words: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
