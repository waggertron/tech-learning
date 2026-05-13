function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxSubarray(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(maxSubarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) === 6);
    assert(maxSubarray([1]) === 1);
    assert(maxSubarray([5, 4, -1, 7, 8]) === 23);
    assert(maxSubarray([-1]) === -1);
    assert(maxSubarray([-2, -3, -1, -5]) === -1);
    assert(maxSubarray([1, 2, 3, 4, 5]) === 15);
    // perf
    const t0 = performance.now();
    maxSubarray(Array.from({ length: 1_000_000 }, (_, i) => i - 500000));
    console.log(`perf maxSubarray(n=1000000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
