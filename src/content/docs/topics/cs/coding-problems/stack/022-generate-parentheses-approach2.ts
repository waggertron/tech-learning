function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function generateParenthesis(n: number): string[] {
    const result: string[] = [];
    function rec(s: string, opens: number, closes: number): void {
        if (opens > n || closes > opens) return;
        if (s.length === 2 * n) { result.push(s); return; }
        rec(s + '(', opens + 1, closes);
        rec(s + ')', opens, closes + 1);
    }
    rec('', 0, 0);
    return result;
}

assert(JSON.stringify(generateParenthesis(1).sort()) === JSON.stringify(['()']));
assert(JSON.stringify(generateParenthesis(2).sort()) === JSON.stringify(['(())', '()()'].sort()));
assert(JSON.stringify(generateParenthesis(3).sort()) === JSON.stringify(['((()))', '(()())', '(())()', '()(())', '()()()'].sort()));
assert(generateParenthesis(4).length === 14);
console.log('all tests pass');
