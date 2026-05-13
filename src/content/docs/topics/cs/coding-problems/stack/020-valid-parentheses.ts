function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isValid(s: string): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isValid('()') === true);
    assert(isValid('()[]{}') === true);
    assert(isValid('(]') === false);
    assert(isValid('([)]') === false);
    assert(isValid('{[]}') === true);
    assert(isValid('') === true);
    assert(isValid('(') === false);
    assert(isValid(')') === false);
    // perf
    const t0 = performance.now();
    isValid('(' .repeat(2500) + ')'.repeat(2500));
    console.log(`perf 5000-char balanced parens: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
