function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function generateParenthesis(n: number): string[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(generateParenthesis(1).sort()) === JSON.stringify(['()']));
    assert(JSON.stringify(generateParenthesis(2).sort()) === JSON.stringify(['(())', '()()'].sort()));
    assert(JSON.stringify(generateParenthesis(3).sort()) === JSON.stringify(['((()))', '(()())', '(())()', '()(())', '()()()'].sort()));
    assert(generateParenthesis(4).length === 14);
    // perf
    const t0 = performance.now();
    generateParenthesis(8);
    console.log(`perf n=8 generate parentheses: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
