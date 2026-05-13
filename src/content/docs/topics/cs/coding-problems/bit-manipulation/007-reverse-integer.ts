function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

const INT_MIN = -(2 ** 31);
const INT_MAX = 2 ** 31 - 1;

function reverse(x: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(reverse(123) === 321);
    assert(reverse(-123) === -321);
    assert(reverse(120) === 21);
    assert(reverse(0) === 0);
    assert(reverse(2 ** 31 - 1) === 0);
    assert(reverse(1534236469) === 0);
    // perf
    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) reverse(1534236469 - i);
    console.log(`perf reverse integer x1000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
