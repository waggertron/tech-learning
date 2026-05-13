function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class TrieNode {
    children: Map<string, TrieNode> = new Map();
    word: string | null = null;
}

function findWords(board: string[][], words: string[]): string[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const board1 = [['o','a','a','n'],['e','t','a','e'],['i','h','k','r'],['i','f','l','v']];
    const result1 = new Set(findWords(board1, ['oath','pea','eat','rain']));
    assert(result1.has('oath') && result1.has('eat') && result1.size === 2);
    assert(JSON.stringify(findWords([['a']], ['a'])) === JSON.stringify(['a']));
    assert(JSON.stringify(findWords([['a']], ['b'])) === JSON.stringify([]));
    const board2 = [['a','b'],['c','d']];
    const result2 = new Set(findWords(board2, ['ab','cd','abdc']));
    assert(result2.has('ab') && result2.has('cd') && result2.has('abdc') && result2.size === 3);
    // perf
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const board = Array.from({ length: 10 }, (_, r) =>
        Array.from({ length: 10 }, (_, c) => chars[(r * 5 + c) % 26])
    );
    const perfWords = Array.from({ length: 100 }, (_, i) =>
        Array.from({ length: 5 + (i % 6) }, (_, j) => chars[(i * 7 + j) % 26]).join('')
    );
    const t0 = performance.now();
    findWords(board, perfWords);
    console.log(`perf findWords(10x10, 100 words): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
