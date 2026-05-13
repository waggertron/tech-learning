function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxArea(height: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) === 49);
    assert(maxArea([1, 1]) === 1);
    assert(maxArea([1, 2, 1]) === 2);
    assert(maxArea([4, 3, 2, 1, 4]) === 16);
    assert(maxArea([1, 2, 4, 3]) === 4);
    // perf
    const t0 = performance.now();
    maxArea(Array.from({ length: 10000 }, (_, i) => i));
    console.log(`perf 10000-element array: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
