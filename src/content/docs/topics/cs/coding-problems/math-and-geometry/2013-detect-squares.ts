function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class DetectSquares {
    // TODO: implement

    add(point: number[]): void {
        // TODO: implement
    }

    count(point: number[]): number {
        // TODO: implement
        return 0;
    }
}

function _runTests(): void {
    const d = new DetectSquares();
    d.add([3, 10]);
    d.add([11, 2]);
    d.add([3, 2]);
    assert(d.count([11, 10]) === 1);
    assert(d.count([14, 8]) === 0);
    d.add([11, 2]);
    assert(d.count([11, 10]) === 2);

    const d2 = new DetectSquares();
    assert(d2.count([0, 0]) === 0);

    const d3 = new DetectSquares();
    d3.add([0, 0]);
    d3.add([2, 0]);
    d3.add([0, 2]);
    d3.add([2, 2]);
    assert(d3.count([0, 0]) === 1);

    const t0 = performance.now();
    const dBig = new DetectSquares();
    for (let i = 0; i < 100_000; i++) {
        dBig.add([i % 100, i % 100]);
        dBig.count([i % 100, (i + 1) % 100]);
    }
    console.log(`perf DetectSquares 100000 add+count ops: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
