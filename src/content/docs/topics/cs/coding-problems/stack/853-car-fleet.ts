function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function carFleet(target: number, position: number[], speed: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]) === 3);
    assert(carFleet(10, [3], [3]) === 1);
    assert(carFleet(100, [0, 2, 4], [4, 2, 1]) === 1);
    assert(carFleet(10, [6, 8], [3, 2]) === 2);
    // perf
    const t0 = performance.now();
    carFleet(500_001, Array.from({ length: 500_000 }, (_, i) => i), new Array(500_000).fill(1));
    console.log(`perf 500000-car fleet: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
