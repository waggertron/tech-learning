function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class MedianFinder {
    // TODO: implement

    addNum(num: number): void {
        // TODO: implement
    }

    findMedian(): number {
        // TODO: implement
        return 0;
    }
}

function _runTests(): void {
    const mf = new MedianFinder();
    mf.addNum(1);
    mf.addNum(2);
    assert(mf.findMedian() === 1.5, `expected 1.5, got ${mf.findMedian()}`);
    mf.addNum(3);
    assert(mf.findMedian() === 2.0, `expected 2.0, got ${mf.findMedian()}`);

    const mf2 = new MedianFinder();
    mf2.addNum(5); assert(mf2.findMedian() === 5.0);
    mf2.addNum(3); assert(mf2.findMedian() === 4.0);
    mf2.addNum(8); assert(mf2.findMedian() === 5.0);
    mf2.addNum(4); assert(mf2.findMedian() === 4.5);

    // perf
    const mfPerf = new MedianFinder();
    const t0 = performance.now();
    for (let i = 0; i < 100_000; i++) mfPerf.addNum(i);
    mfPerf.findMedian();
    console.log(`perf MedianFinder 100000 inserts: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
