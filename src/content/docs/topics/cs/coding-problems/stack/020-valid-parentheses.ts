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
    isValid('(' .repeat(500_000) + ')'.repeat(500_000));
    console.log(`perf 1000000-char balanced parens: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
