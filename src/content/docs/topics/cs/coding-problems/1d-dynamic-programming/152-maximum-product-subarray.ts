function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxProduct(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(maxProduct([2, 3, -2, 4]) === 6);
    assert(maxProduct([-2, 0, -1]) === 0);
    assert(maxProduct([-2, 3, -4]) === 24);
    assert(maxProduct([0]) === 0);
    assert(maxProduct([-3]) === -3);
    assert(maxProduct([-2, -3]) === 6);
    // perf
    const t0 = performance.now();
    maxProduct(Array.from({ length: 500 }, (_, i) => (i % 3 === 0 ? -1 : i + 1)));
    console.log(`perf maxProduct(500 mixed): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
