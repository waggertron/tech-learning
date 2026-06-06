function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function increasingTriplet(nums: number[]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(increasingTriplet([1, 2, 3, 4, 5]) === true);
    assert(increasingTriplet([5, 4, 3, 2, 1]) === false);
    assert(increasingTriplet([2, 1, 5, 0, 4, 6]) === true);
    assert(increasingTriplet([1, 2]) === false);
    assert(increasingTriplet([1, 1, 1, 1, 1]) === false);
    assert(increasingTriplet([20, 100, 10, 12, 5, 13]) === true);
    // perf
    const t0 = performance.now();
    increasingTriplet(Array.from({ length: 500_000 }, (_, i) => i));
    console.log(`perf increasingTriplet(n=500000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
