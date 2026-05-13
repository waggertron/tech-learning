function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function alienOrder(words: string[]): string {
    // TODO: implement
    return '';
}

function _runTests(): void {
    const r1 = alienOrder(['wrt', 'wrf', 'er', 'ett', 'rftt']);
    assert(r1 === 'wertf', `got ${JSON.stringify(r1)}`);
    const r2 = alienOrder(['z', 'x']);
    assert(r2 === 'zx', `got ${JSON.stringify(r2)}`);
    assert(alienOrder(['z', 'x', 'z']) === '');
    assert(alienOrder(['abc', 'ab']) === '');
    const r3 = alienOrder(['abc']);
    assert(new Set(r3).size === 3 && r3.includes('a') && r3.includes('b') && r3.includes('c'), `got ${JSON.stringify(r3)}`);
    // perf
    const bigWords = Array.from({ length: 200 }, (_, i) =>
        String.fromCharCode(97 + (i % 26)).repeat(3) + String.fromCharCode(97 + ((i + 1) % 26)));
    const t0 = performance.now();
    alienOrder(bigWords);
    console.log(`perf alien-dictionary 200 words: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
