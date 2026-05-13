function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function simplifyPath(path: string): string {
    const parts = path.split('/');
    const stack: string[] = [];
    for (const part of parts) {
        if (!part || part === '.') continue;
        if (part === '..') {
            if (stack.length) stack.pop();
        } else {
            stack.push(part);
        }
    }
    return '/' + stack.join('/');
}

assert(simplifyPath('/home/') === '/home');
assert(simplifyPath('/home//foo/') === '/home/foo');
assert(simplifyPath('/home/user/Documents/../Pictures') === '/home/user/Pictures');
assert(simplifyPath('/../') === '/');
assert(simplifyPath('/a/./b/../../c/') === '/c');
assert(simplifyPath('/') === '/');
console.log('all tests pass');
