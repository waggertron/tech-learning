function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function multiply(num1: string, num2: string): string {
    // TODO: implement
    return '';
}

function _runTests(): void {
    assert(multiply('2', '3') === '6');
    assert(multiply('123', '456') === '56088');
    assert(multiply('0', '12345') === '0');
    assert(multiply('99', '99') === '9801');
    assert(multiply('1', '1') === '1');
    assert(multiply('9999', '9999') === '99980001');

    const t0 = performance.now();
    multiply('9'.repeat(1000), '9'.repeat(1000));
    console.log(`perf multiply 1000-digit strings: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
