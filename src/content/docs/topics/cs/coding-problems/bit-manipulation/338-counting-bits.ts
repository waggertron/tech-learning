function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function countBits(n: number): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(countBits(2)) === JSON.stringify([0, 1, 1]));
    assert(JSON.stringify(countBits(5)) === JSON.stringify([0, 1, 1, 2, 1, 2]));
    assert(JSON.stringify(countBits(0)) === JSON.stringify([0]));
    assert(JSON.stringify(countBits(1)) === JSON.stringify([0, 1]));
    assert(JSON.stringify(countBits(8)) === JSON.stringify([0, 1, 1, 2, 1, 2, 2, 3, 1]));
    // perf
    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) countBits(1000);
    console.log(`perf countBits n=1000 x1000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
