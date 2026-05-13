function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function checkValidString(s: string): boolean {
    const memo = new Map<string, boolean>();
    function f(i: number, opens: number): boolean {
        if (opens < 0) return false;
        if (i === s.length) return opens === 0;
        const key = `${i},${opens}`;
        if (memo.has(key)) return memo.get(key)!;
        let result: boolean;
        if (s[i] === '(') {
            result = f(i + 1, opens + 1);
        } else if (s[i] === ')') {
            result = f(i + 1, opens - 1);
        } else {
            result = f(i + 1, opens + 1) || f(i + 1, opens) || f(i + 1, opens - 1);
        }
        memo.set(key, result);
        return result;
    }
    return f(0, 0);
}

assert(checkValidString('()') === true);
assert(checkValidString('(*)') === true);
assert(checkValidString('(*))') === true);
assert(checkValidString('((') === false);
assert(checkValidString('*') === true);
assert(checkValidString('(*') === true);
assert(checkValidString(')') === false);
console.log("all tests pass");
