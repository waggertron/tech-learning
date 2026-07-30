function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minSubArrayLen(target: number, nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]) === 2);
    assert(minSubArrayLen(4, [1, 4, 4]) === 1);
    assert(minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1]) === 0);
    assert(minSubArrayLen(3, [1, 1, 1]) === 3);
    assert(minSubArrayLen(15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]) === 2);

    const t0 = performance.now();
    minSubArrayLen(5000, Array.from({ length: 10000 }, () => 1));
    console.log(`perf minimum-size-subarray-sum n=10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
