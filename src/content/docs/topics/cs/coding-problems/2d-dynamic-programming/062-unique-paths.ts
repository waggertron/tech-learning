function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function uniquePaths(m: number, n: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(uniquePaths(3, 7) === 28);
    assert(uniquePaths(3, 2) === 3);
    assert(uniquePaths(1, 1) === 1);
    assert(uniquePaths(1, 5) === 1);
    assert(uniquePaths(5, 1) === 1);
    assert(uniquePaths(3, 3) === 6);
    const t0 = performance.now();
    for (let i = 0; i < 1_000_000; i++) uniquePaths(100, 100);
    console.log(`perf uniquePaths(100, 100) x1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
