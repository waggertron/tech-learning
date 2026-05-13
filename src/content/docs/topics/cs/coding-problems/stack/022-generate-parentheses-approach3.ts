function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function generateParenthesis(n: number): string[] {
    const result: string[] = [];
    const path: string[] = [];

    function backtrack(opens: number, closes: number): void {
        if (opens === n && closes === n) {
            result.push(path.join(''));
            return;
        }
        if (opens < n) {
            path.push('(');
            backtrack(opens + 1, closes);
            path.pop();
        }
        if (closes < opens) {
            path.push(')');
            backtrack(opens, closes + 1);
            path.pop();
        }
    }

    backtrack(0, 0);
    return result;
}

assert(JSON.stringify(generateParenthesis(1).sort()) === JSON.stringify(['()']));
assert(JSON.stringify(generateParenthesis(2).sort()) === JSON.stringify(['(())', '()()'].sort()));
assert(JSON.stringify(generateParenthesis(3).sort()) === JSON.stringify(['((()))', '(()())', '(())()', '()(())', '()()()'].sort()));
assert(generateParenthesis(4).length === 14);
console.log('all tests pass');
