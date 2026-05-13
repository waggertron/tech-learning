function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function decodeString(s: string): string {
    // TODO: implement
    return '';
}

function _runTests(): void {
    assert(decodeString('3[a]2[bc]') === 'aaabcbc');
    assert(decodeString('3[a2[c]]') === 'accaccacc');
    assert(decodeString('2[abc]3[cd]ef') === 'abcabccdcdcdef');
    assert(decodeString('a') === 'a');
    console.log('all tests pass');
}

_runTests();
