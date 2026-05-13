function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canJump(nums: number[]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(canJump([2, 3, 1, 1, 4]) === true);
    assert(canJump([3, 2, 1, 0, 4]) === false);
    assert(canJump([0]) === true);
    assert(canJump([1, 0]) === true);
    assert(canJump([0, 1]) === false);
    assert(canJump([2, 0, 0]) === true);
    // perf
    const t0 = performance.now();
    canJump(Array(1_000_000).fill(1));
    console.log(`perf canJump(n=1000000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
