function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function decodeString(s: string): string {
    const stack: [number, string][] = [];
    let currentString = '';
    let currentCount = 0;

    for (const ch of s) {
        if (ch >= '0' && ch <= '9') {
            currentCount = currentCount * 10 + Number(ch);
        } else if (ch === '[') {
            stack.push([currentCount, currentString]);
            currentCount = 0;
            currentString = '';
        } else if (ch === ']') {
            const [count, prefix] = stack.pop()!;
            currentString = prefix + currentString.repeat(count);
        } else {
            currentString += ch;
        }
    }

    return currentString;
}

assert(decodeString('3[a]2[bc]') === 'aaabcbc');
assert(decodeString('3[a2[c]]') === 'accaccacc');
assert(decodeString('2[abc]3[cd]ef') === 'abcabccdcdcdef');
assert(decodeString('a') === 'a');
console.log('all tests pass');
