function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isHappy(n: number): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isHappy(19) === true);
    assert(isHappy(2) === false);
    assert(isHappy(1) === true);
    assert(isHappy(7) === true);
    assert(isHappy(4) === false);
    assert(isHappy(100) === true);

    const t0 = performance.now();
    for (let n = 1; n <= 1000; n++) {
        isHappy(n);
    }
    console.log(`perf isHappy n=1..1000: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
