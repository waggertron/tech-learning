function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function search(nums: number[], target: number): number {
    // TODO: implement
    return -1;
}

function _runTests(): void {
    assert(search([-1, 0, 3, 5, 9, 12], 9) === 4);
    assert(search([-1, 0, 3, 5, 9, 12], 2) === -1);
    assert(search([5], 5) === 0);
    assert(search([5], 3) === -1);
    assert(search([-1, 0, 3, 5, 9, 12], -1) === 0);
    assert(search([-1, 0, 3, 5, 9, 12], 12) === 5);
    // perf
    const arr = Array.from({ length: 100000 }, (_, i) => i);
    const t0 = performance.now();
    for (let i = 0; i < 1_000_000; i++) search(arr, 99999);
    console.log(`perf binary search n=100000 x1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
