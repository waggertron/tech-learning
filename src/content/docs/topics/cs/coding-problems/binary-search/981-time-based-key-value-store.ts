function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class TimeMap {
    // TODO: implement

    set(key: string, value: string, timestamp: number): void {
        // TODO: implement
    }

    get(key: string, timestamp: number): string {
        // TODO: implement
        return '';
    }
}

function _runTests(): void {
    const store = new TimeMap();
    store.set('foo', 'bar', 1);
    assert(store.get('foo', 1) === 'bar');
    assert(store.get('foo', 3) === 'bar');
    store.set('foo', 'bar2', 4);
    assert(store.get('foo', 4) === 'bar2');
    assert(store.get('foo', 5) === 'bar2');
    assert(store.get('foo', 0) === '');
    assert(store.get('missing', 1) === '');
    // perf
    const bigStore = new TimeMap();
    for (let i = 0; i < 100000; i++) bigStore.set('key', `val${i}`, i + 1);
    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) bigStore.get('key', i * 100 + 1);
    console.log(`perf TimeMap.get x1000 over 100000 entries: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
