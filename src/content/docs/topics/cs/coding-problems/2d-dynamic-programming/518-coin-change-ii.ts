function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function change(amount: number, coins: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(change(5, [1, 2, 5]) === 4);
    assert(change(3, [2]) === 0);
    assert(change(0, [1, 2, 5]) === 1);
    assert(change(10, [5]) === 1);
    assert(change(10, [1, 5, 10]) === 4);
    const t0 = performance.now();
    change(1_000_000, [1, 2, 5, 10, 25, 50]);
    console.log(`perf change(1000000, [1,2,5,10,25,50]): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
