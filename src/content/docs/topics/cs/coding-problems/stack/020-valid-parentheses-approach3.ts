function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isValid(s: string): boolean {
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    const stack: string[] = [];
    for (const ch of s) {
        if (Object.values(pairs).includes(ch)) {
            stack.push(ch);
        } else {
            if (!stack.length || stack.pop() !== pairs[ch]) return false;
        }
    }
    return stack.length === 0;
}

assert(isValid('()') === true);
assert(isValid('()[]{}') === true);
assert(isValid('(]') === false);
assert(isValid('([)]') === false);
assert(isValid('{[]}') === true);
assert(isValid('') === true);
assert(isValid('(') === false);
assert(isValid(')') === false);
console.log('all tests pass');
