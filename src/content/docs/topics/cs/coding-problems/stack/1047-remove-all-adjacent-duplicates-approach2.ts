function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function removeDuplicates(s: string): string {
    const stack: string[] = [];
    for (const ch of s) {
        if (stack.length && stack[stack.length - 1] === ch) {
            stack.pop();
        } else {
            stack.push(ch);
        }
    }
    return stack.join('');
}

assert(removeDuplicates('abbaca') === 'ca');
assert(removeDuplicates('azxxzy') === 'ay');
assert(removeDuplicates('a') === 'a');
assert(removeDuplicates('aa') === '');
assert(removeDuplicates('abcd') === 'abcd');
console.log('all tests pass');
