function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minCostClimbingStairs(cost: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(minCostClimbingStairs([10, 15, 20]) === 15);
    assert(minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) === 6);
    assert(minCostClimbingStairs([0, 0]) === 0);
    assert(minCostClimbingStairs([1, 2]) === 1);
    assert(minCostClimbingStairs([5, 3, 1, 2]) === 4);
    // perf
    const t0 = performance.now();
    minCostClimbingStairs(new Array(1_000_000).fill(1));
    console.log(`perf minCostClimbingStairs(1000000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
