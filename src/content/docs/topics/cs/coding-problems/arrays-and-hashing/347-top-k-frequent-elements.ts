function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function topKFrequent(nums: number[], k: number): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify([...topKFrequent([1, 1, 1, 2, 2, 3], 2)].sort((a, b) => a - b)) === JSON.stringify([1, 2]));
    assert(JSON.stringify(topKFrequent([1], 1)) === JSON.stringify([1]));
    assert(JSON.stringify([...topKFrequent([1, 2], 2)].sort((a, b) => a - b)) === JSON.stringify([1, 2]));
    const r = topKFrequent([1, 2, 3], 1);
    assert(r.length === 1 && [1, 2, 3].includes(r[0]));
    // perf
    const nums = Array.from({ length: 10000 }, (_, i) => i % 100);
    const t0 = performance.now();
    topKFrequent(nums, 10);
    console.log(`perf topKFrequent n=10000 k=10: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
