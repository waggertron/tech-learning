function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function dailyTemperatures(temperatures: number[]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])) === JSON.stringify([1, 1, 4, 2, 1, 1, 0, 0]));
    assert(JSON.stringify(dailyTemperatures([30, 40, 50, 60])) === JSON.stringify([1, 1, 1, 0]));
    assert(JSON.stringify(dailyTemperatures([30, 60, 90])) === JSON.stringify([1, 1, 0]));
    assert(JSON.stringify(dailyTemperatures([90, 60, 30])) === JSON.stringify([0, 0, 0]));
    assert(JSON.stringify(dailyTemperatures([70])) === JSON.stringify([0]));
    // perf
    const t0 = performance.now();
    dailyTemperatures(Array.from({ length: 1_000_000 }, (_, i) => i % 100));
    console.log(`perf 1000000-element temperatures: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
