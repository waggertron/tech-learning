function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function wordBreak(s: string, wordDict: string[]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(wordBreak('leetcode', ['leet', 'code']) === true);
    assert(wordBreak('applepenapple', ['apple', 'pen']) === true);
    assert(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']) === false);
    assert(wordBreak('a', ['a']) === true);
    assert(wordBreak('a', ['b']) === false);
    assert(wordBreak('aaaa', ['a', 'aa']) === true);
    // perf
    const t0 = performance.now();
    wordBreak('a'.repeat(1000), ['a', 'aa', 'aaa', 'aaaa']);
    console.log(`perf wordBreak("a"*1000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
