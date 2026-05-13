function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function jump(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(jump([2, 3, 1, 1, 4]) === 2);
    assert(jump([2, 3, 0, 1, 4]) === 2);
    assert(jump([1]) === 0);
    assert(jump([1, 1, 1, 1]) === 3);
    assert(jump([5, 4, 3, 2, 1, 0]) === 1);
    // perf
    const t0 = performance.now();
    jump(Array(10000).fill(2));
    console.log(`perf jump(n=10000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
