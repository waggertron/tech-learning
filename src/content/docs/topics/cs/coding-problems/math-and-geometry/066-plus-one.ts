function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function plusOne(digits: number[]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(plusOne([1, 2, 3])) === JSON.stringify([1, 2, 4]));
    assert(JSON.stringify(plusOne([9, 9, 9])) === JSON.stringify([1, 0, 0, 0]));
    assert(JSON.stringify(plusOne([0])) === JSON.stringify([1]));
    assert(JSON.stringify(plusOne([9])) === JSON.stringify([1, 0]));
    assert(JSON.stringify(plusOne([1, 0, 9])) === JSON.stringify([1, 1, 0]));
    assert(JSON.stringify(plusOne([4, 3, 2, 1])) === JSON.stringify([4, 3, 2, 2]));

    const t0 = performance.now();
    for (let i = 0; i < 1_000_000; i++) plusOne(new Array(10).fill(9));
    console.log(`perf plusOne 10-digit all-nines x1000000: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
