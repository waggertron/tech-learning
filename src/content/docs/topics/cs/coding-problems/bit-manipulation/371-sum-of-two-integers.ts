function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function getSum(a: number, b: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(getSum(1, 2) === 3);
    assert(getSum(2, 3) === 5);
    assert(getSum(0, 0) === 0);
    assert(getSum(-1, 1) === 0);
    assert(getSum(-5, 3) === -2);
    assert(getSum(2 ** 30, 2 ** 30) === 2 ** 31);
    // perf
    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) getSum(i, i + 1);
    console.log(`perf getSum x1000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
