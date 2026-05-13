function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function checkValidString(s: string): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(checkValidString('()') === true);
    assert(checkValidString('(*)') === true);
    assert(checkValidString('(*))') === true);
    assert(checkValidString('((') === false);
    assert(checkValidString('*') === true);
    assert(checkValidString('(*') === true);
    assert(checkValidString(')') === false);
    // perf
    const t0 = performance.now();
    checkValidString('(*'.repeat(5000));
    console.log(`perf checkValidString(n=10000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
