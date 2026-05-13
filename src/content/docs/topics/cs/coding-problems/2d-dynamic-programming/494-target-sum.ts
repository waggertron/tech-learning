function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findTargetSumWays(nums: number[], target: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(findTargetSumWays([1, 1, 1, 1, 1], 3) === 5);
    assert(findTargetSumWays([1], 1) === 1);
    assert(findTargetSumWays([1, 1], 0) === 2);
    assert(findTargetSumWays([1, 2], 4) === 0);
    assert(findTargetSumWays([1], -1) === 1);
    assert(findTargetSumWays([0, 0, 0], 0) === 8);
    const t0 = performance.now();
    findTargetSumWays(new Array(30).fill(1), 0);
    console.log(`perf findTargetSumWays([1]*30, 0): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
