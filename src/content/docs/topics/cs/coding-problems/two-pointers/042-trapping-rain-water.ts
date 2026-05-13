function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function trap(height: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) === 6);
    assert(trap([4, 2, 0, 3, 2, 5]) === 9);
    assert(trap([]) === 0);
    assert(trap([3]) === 0);
    assert(trap([3, 0, 3]) === 3);
    assert(trap([1, 0, 1]) === 1);
    // perf
    const big = [...Array.from({ length: 5000 }, (_, i) => i), ...Array.from({ length: 5000 }, (_, i) => 5000 - i)];
    const t0 = performance.now();
    trap(big);
    console.log(`perf 10000-element array: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
