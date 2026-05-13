function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minRemoveToMakeValid(s: string): string {
    const stack: number[] = [];
    const remove = new Set<number>();

    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            stack.push(i);
        } else if (s[i] === ')') {
            if (stack.length) {
                stack.pop();
            } else {
                remove.add(i);
            }
        }
    }

    for (const i of stack) remove.add(i);

    const result: string[] = [];
    for (let i = 0; i < s.length; i++) {
        if (!remove.has(i)) result.push(s[i]);
    }
    return result.join('');
}

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
