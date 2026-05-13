function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minRemoveToMakeValid(s: string): string {
    // TODO: implement
    return '';
}

function _runTests(): void {
    function isValid(t: string): boolean {
        let count = 0;
        for (const ch of t) {
            if (ch === '(') count++;
            else if (ch === ')') { if (count === 0) return false; count--; }
        }
        return count === 0;
    }

    let result = minRemoveToMakeValid('lee(t(c)o)de)');
    assert(isValid(result) && result.length === 13);
    result = minRemoveToMakeValid('a)b(c)d');
    assert(isValid(result) && result.length === 6);
    assert(minRemoveToMakeValid('))((') === '');
    result = minRemoveToMakeValid('(a(b(c)d)');
    assert(isValid(result));
    console.log('all tests pass');
}

_runTests();
