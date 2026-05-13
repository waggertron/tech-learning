function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function climbStairs(n: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(climbStairs(1) === 1);
    assert(climbStairs(2) === 2);
    assert(climbStairs(3) === 3);
    assert(climbStairs(4) === 5);
    assert(climbStairs(5) === 8);
    assert(climbStairs(10) === 89);
    // perf
    const t0 = performance.now();
    climbStairs(1_000_000);
    console.log(`perf climbStairs(1000000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
