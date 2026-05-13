function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function numDecodings(s: string): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(numDecodings('12') === 2);
    assert(numDecodings('226') === 3);
    assert(numDecodings('06') === 0);
    assert(numDecodings('0') === 0);
    assert(numDecodings('1') === 1);
    assert(numDecodings('11106') === 2);
    // perf
    const t0 = performance.now();
    numDecodings('1'.repeat(500));
    console.log(`perf numDecodings("1"*500): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
