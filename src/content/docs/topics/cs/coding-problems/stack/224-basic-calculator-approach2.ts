function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function calculate(s: string): number {
    const stack: [number, number][] = [];  // (result, sign) on open paren
    let result = 0;
    let sign = 1;
    let num = 0;

    for (const ch of s) {
        if (ch >= '0' && ch <= '9') {
            num = num * 10 + Number(ch);
        } else if (ch === '+' || ch === '-') {
            result += sign * num;
            num = 0;
            sign = ch === '+' ? 1 : -1;
        } else if (ch === '(') {
            stack.push([result, sign]);
            result = 0;
            sign = 1;
            num = 0;
        } else if (ch === ')') {
            result += sign * num;
            num = 0;
            const [prevResult, prevSign] = stack.pop()!;
            result = prevResult + prevSign * result;
        }
    }

    return result + sign * num;
}

assert(calculate('1 + 1') === 2);
assert(calculate(' 2-1 + 2 ') === 3);
assert(calculate('(1+(4+5+2)-3)+(6+8)') === 23);
assert(calculate('1-(     -2)') === 3);
assert(calculate('- (3 + (4 + 5))') === -12);
console.log('all tests pass');
