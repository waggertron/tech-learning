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
        // TODO: implement
    }

    search(word: string): boolean {
        // TODO: implement
        return false;
    }
}

function _runTests(): void {
    const wd = new WordDictionary();
    wd.addWord('bad'); wd.addWord('dad'); wd.addWord('mad');
    assert(wd.search('pad') === false);
    assert(wd.search('bad') === true);
    assert(wd.search('.ad') === true);
    assert(wd.search('b..') === true);
    assert(wd.search('...') === true);
    assert(wd.search('....') === false);
    // perf
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const words = Array.from({ length: 1000 }, (_, i) =>
        Array.from({ length: 5 + (i % 6) }, (_, j) => chars[(i * 7 + j) % 26]).join('')
    );
    const bigWd = new WordDictionary();
    const t0 = performance.now();
    words.forEach(w => bigWd.addWord(w));
    words.forEach(w => bigWd.search(w));
    console.log(`perf WordDictionary 1000 words: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
