function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function evalRpn(tokens: string[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(evalRpn(['2', '1', '+', '3', '*']) === 9);
    assert(evalRpn(['4', '13', '5', '/', '+']) === 6);
    assert(evalRpn(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']) === 22);
    assert(evalRpn(['3']) === 3);
    assert(evalRpn(['6', '2', '/']) === 3);
    assert(evalRpn(['7', '2', '/']) === 3);
    assert(evalRpn(['-7', '2', '/']) === -3);
    // perf
    const tokens = [...Array(500_000).fill('1'), ...Array(499_999).fill('+')];
    const t0 = performance.now();
    evalRpn(tokens);
    console.log(`perf 999999-token RPN expression: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
