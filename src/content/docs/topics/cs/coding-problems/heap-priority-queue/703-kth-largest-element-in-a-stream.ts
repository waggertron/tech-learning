function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class KthLargest {
    // TODO: implement

    constructor(k: number, nums: number[]) {
        // TODO: implement
    }

    add(val: number): number {
        // TODO: implement
        return 0;
    }
}

function _runTests(): void {
    const kl = new KthLargest(3, [4, 5, 8, 2]);
    assert(kl.add(3) === 4);
    assert(kl.add(5) === 5);
    assert(kl.add(10) === 5);
    assert(kl.add(9) === 8);
    assert(kl.add(4) === 8);

    const kl2 = new KthLargest(1, []);
    assert(kl2.add(-3) === -3);
    assert(kl2.add(-2) === -2);
    assert(kl2.add(-4) === -2);
    assert(kl2.add(0) === 0);
    assert(kl2.add(4) === 4);

    // perf
    const klPerf = new KthLargest(500, Array.from({ length: 1000 }, (_, i) => i));
    const t0 = performance.now();
    for (let i = 1000; i < 101_000; i++) klPerf.add(i);
    console.log(`perf KthLargest 100000 adds: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
