function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function myPow(x: number, n: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(Math.abs(myPow(2.0, 10) - 1024.0) < 1e-9);
    assert(Math.abs(myPow(2.0, -2) - 0.25) < 1e-9);
    assert(Math.abs(myPow(2.0, 0) - 1.0) < 1e-9);
    assert(Math.abs(myPow(1.0, 1000000) - 1.0) < 1e-9);
    assert(Math.abs(myPow(0.0, 5) - 0.0) < 1e-9);
    assert(Math.abs(myPow(2.0, 1) - 2.0) < 1e-9);

    const t0 = performance.now();
    myPow(1.0000001, 1000000);
    console.log(`perf myPow x=1.0000001 n=1000000: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
