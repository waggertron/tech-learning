function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function missingNumber(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(missingNumber([3, 0, 1]) === 2);
    assert(missingNumber([0, 1]) === 2);
    assert(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]) === 8);
    assert(missingNumber([0]) === 1);
    assert(missingNumber([1]) === 0);
    assert(missingNumber([0, 1, 2, 4, 5]) === 3);
    // perf
    const nums = Array.from({ length: 1000 }, (_, i) => i);
    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) missingNumber(nums);
    console.log(`perf missingNumber n=1000 x1000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
