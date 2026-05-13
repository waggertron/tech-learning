function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function evalRpn(tokens: string[]): number {
    const ops: Record<string, (a: number, b: number) => number> = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => Math.trunc(a / b),
    };
    const stack: number[] = [];
    for (const tok of tokens) {
        if (tok in ops) {
            const b = stack.pop()!;
            const a = stack.pop()!;
            stack.push(ops[tok](a, b));
        } else {
            stack.push(Number(tok));
        }
    }
    return stack[0];
}

assert(evalRpn(['2', '1', '+', '3', '*']) === 9);
assert(evalRpn(['4', '13', '5', '/', '+']) === 6);
assert(evalRpn(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']) === 22);
assert(evalRpn(['3']) === 3);
assert(evalRpn(['6', '2', '/']) === 3);
assert(evalRpn(['7', '2', '/']) === 3);
assert(evalRpn(['-7', '2', '/']) === -3);
console.log('all tests pass');
