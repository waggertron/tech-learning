function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canPartition(nums: number[]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(canPartition([1, 5, 11, 5]) === true);
    assert(canPartition([1, 2, 3, 5]) === false);
    assert(canPartition([1]) === false);
    assert(canPartition([2, 2]) === true);
    assert(canPartition([1, 2, 5]) === false);
    assert(canPartition([3, 3, 3, 4, 5]) === true);
    // perf
    const t0 = performance.now();
    canPartition(Array.from({ length: 200 }, (_, i) => i + 1));
    console.log(`perf canPartition(1..200): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
