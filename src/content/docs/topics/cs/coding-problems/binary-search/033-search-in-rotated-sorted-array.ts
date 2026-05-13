function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function search(nums: number[], target: number): number {
    // TODO: implement
    return -1;
}

function _runTests(): void {
    assert(search([4, 5, 6, 7, 0, 1, 2], 0) === 4);
    assert(search([4, 5, 6, 7, 0, 1, 2], 3) === -1);
    assert(search([1], 0) === -1);
    assert(search([1], 1) === 0);
    assert(search([3, 1], 1) === 1);
    assert(search([3, 1], 3) === 0);
    // perf
    const arr = [...Array.from({ length: 50000 }, (_, i) => i + 50000), ...Array.from({ length: 50000 }, (_, i) => i)];
    const t0 = performance.now();
    for (let i = 0; i < 1_000_000; i++) search(arr, 99999);
    console.log(`perf search rotated n=100000 x1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
