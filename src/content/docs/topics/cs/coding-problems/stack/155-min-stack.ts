function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class MinStack {
    // TODO: implement
    push(val: number): void {}
    pop(): void {}
    top(): number { return 0; }
    getMin(): number { return 0; }
}

function _runTests(): void {
    const ms = new MinStack();
    ms.push(-2);
    ms.push(0);
    ms.push(-3);
    assert(ms.getMin() === -3);
    ms.pop();
    assert(ms.top() === 0);
    assert(ms.getMin() === -2);

    const ms2 = new MinStack();
    ms2.push(1);
    ms2.push(2);
    ms2.push(3);
    assert(ms2.getMin() === 1);
    ms2.pop();
    assert(ms2.getMin() === 1);

    const ms3 = new MinStack();
    ms3.push(5);
    assert(ms3.top() === 5);
    assert(ms3.getMin() === 5);

    // perf
    const msPerf = new MinStack();
    const t0 = performance.now();
    for (let i = 0; i < 500_000; i++) msPerf.push(i);
    msPerf.getMin();
    console.log(`perf 500000-element push + getMin: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
