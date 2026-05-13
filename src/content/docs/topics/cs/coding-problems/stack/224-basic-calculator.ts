function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function calculate(s: string): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(calculate('1 + 1') === 2);
    assert(calculate(' 2-1 + 2 ') === 3);
    assert(calculate('(1+(4+5+2)-3)+(6+8)') === 23);
    assert(calculate('1-(     -2)') === 3);
    assert(calculate('- (3 + (4 + 5))') === -12);
    console.log('all tests pass');
}

_runTests();
