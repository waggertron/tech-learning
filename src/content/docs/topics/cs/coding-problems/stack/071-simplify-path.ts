function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function simplifyPath(path: string): string {
    // TODO: implement
    return '';
}

function _runTests(): void {
    assert(simplifyPath('/home/') === '/home');
    assert(simplifyPath('/home//foo/') === '/home/foo');
    assert(simplifyPath('/home/user/Documents/../Pictures') === '/home/user/Pictures');
    assert(simplifyPath('/../') === '/');
    assert(simplifyPath('/a/./b/../../c/') === '/c');
    assert(simplifyPath('/') === '/');
    console.log('all tests pass');
}

_runTests();
