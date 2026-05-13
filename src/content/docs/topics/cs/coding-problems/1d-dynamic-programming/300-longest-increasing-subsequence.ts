function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function lengthOfLIS(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]) === 4);
    assert(lengthOfLIS([0, 1, 0, 3, 2, 3]) === 4);
    assert(lengthOfLIS([7, 7, 7, 7]) === 1);
    assert(lengthOfLIS([1]) === 1);
    assert(lengthOfLIS([1, 2, 3, 4, 5]) === 5);
    assert(lengthOfLIS([5, 4, 3, 2, 1]) === 1);
    // perf
    const t0 = performance.now();
    lengthOfLIS(Array.from({ length: 500 }, (_, i) => i));
    console.log(`perf lengthOfLIS(sorted 500): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
