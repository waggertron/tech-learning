function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function letterCombinations(digits: string): string[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(letterCombinations('').sort()) === JSON.stringify([].sort()));
    assert(JSON.stringify(letterCombinations('2').sort()) === JSON.stringify(['a', 'b', 'c'].sort()));
    assert(
        JSON.stringify(letterCombinations('23').sort()) ===
        JSON.stringify(['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'].sort())
    );
    assert(JSON.stringify(letterCombinations('7').sort()) === JSON.stringify(['p', 'q', 'r', 's'].sort()));
    assert(letterCombinations('22').length === 9);
    // perf
    const t0 = performance.now();
    for (let i = 0; i < 10_000; i++) letterCombinations('23456789');
    console.log(`perf letterCombinations("23456789") x10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
