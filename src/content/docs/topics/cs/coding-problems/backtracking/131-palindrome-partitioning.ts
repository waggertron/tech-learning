function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function partition(s: string): string[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const norm = (arr: string[][]): string =>
        JSON.stringify(arr.map(a => [...a]).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
    const r = partition('aab');
    assert(norm(r) === norm([['a','a','b'],['aa','b']]));
    assert(JSON.stringify(partition('a')) === JSON.stringify([['a']]));
    const r3 = partition('aaa');
    assert(norm(r3) === norm([['a','a','a'],['a','aa'],['aa','a'],['aaa']]));
    const r4 = partition('abc');
    assert(norm(r4) === norm([['a','b','c']]));
    // perf
    const t0 = performance.now();
    partition('aabbccddeeff');
    console.log(`perf partition("aabbccddeeff") n=12: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
