function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function normalize(result: string[][]): string[][] {
    return result.map(g => [...g].sort()).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
}

function groupAnagrams(strs: string[]): string[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const r1 = groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
    assert(JSON.stringify(normalize(r1)) === JSON.stringify([['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]));
    const r2 = groupAnagrams(['']);
    assert(JSON.stringify(normalize(r2)) === JSON.stringify([['']]));
    const r3 = groupAnagrams(['a']);
    assert(JSON.stringify(normalize(r3)) === JSON.stringify([['a']]));
    const r4 = groupAnagrams(['abc', 'bca', 'cab']);
    assert(JSON.stringify(normalize(r4)) === JSON.stringify([['abc', 'bca', 'cab']]));
    const r5 = groupAnagrams(['a', 'b', 'c']);
    assert(JSON.stringify(normalize(r5)) === JSON.stringify([['a'], ['b'], ['c']]));
    // perf
    const big = Array.from({ length: 500_000 }, (_, i) => 'a'.repeat((i % 5) + 1));
    const t0 = performance.now();
    groupAnagrams(big);
    console.log(`perf groupAnagrams n=500000 strings: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
