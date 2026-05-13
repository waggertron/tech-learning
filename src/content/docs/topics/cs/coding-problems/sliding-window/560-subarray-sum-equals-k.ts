function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function subarraySum(nums: number[], k: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(subarraySum([1, 1, 1], 2) === 2);
    assert(subarraySum([1, 2, 3], 3) === 2);
    assert(subarraySum([1], 0) === 0);
    assert(subarraySum([1], 1) === 1);
    assert(subarraySum([-1, -1, 1], 0) === 1);
    // perf
    const t0 = performance.now();
    subarraySum(Array.from({ length: 10000 }, (_, i) => i), 100);
    console.log(`perf subarray_sum n=10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
