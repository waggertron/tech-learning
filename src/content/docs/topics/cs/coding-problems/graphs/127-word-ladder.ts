function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(ladderLength('hit', 'cog', ['hot','dot','dog','lot','log','cog']) === 5);
    assert(ladderLength('hit', 'cot', ['hot','dot','dog','lot','log','cog']) === 0);
    assert(ladderLength('hot', 'dot', ['dot','lot']) === 2);
    assert(ladderLength('hit', 'cog', ['hot','dot','dog','lot','log']) === 0);
    assert(ladderLength('a', 'c', ['a','b','c']) === 2);
    // perf
    const bigList = Array.from({ length: 200 }, (_, i) => String.fromCharCode(65 + (i % 26)).repeat(4));
    const t0 = performance.now();
    ladderLength('aaaa', 'zzzz', bigList);
    console.log(`perf word-ladder 200-word list: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
