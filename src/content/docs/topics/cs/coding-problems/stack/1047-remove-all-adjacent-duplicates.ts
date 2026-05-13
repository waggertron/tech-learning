function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function removeDuplicates(s: string): string {
    // TODO: implement
    return '';
}

function _runTests(): void {
    assert(removeDuplicates('abbaca') === 'ca');
    assert(removeDuplicates('azxxzy') === 'ay');
    assert(removeDuplicates('a') === 'a');
    assert(removeDuplicates('aa') === '');
    assert(removeDuplicates('abcd') === 'abcd');
    console.log('all tests pass');
}

_runTests();
