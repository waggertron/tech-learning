function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
    // TODO: implement
    return -1;
}

function _runTests(): void {
    const flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]];
    assert(findCheapestPrice(4, flights, 0, 3, 1) === 700);
    assert(findCheapestPrice(4, flights, 0, 3, 0) === -1);
    assert(findCheapestPrice(4, flights, 0, 3, 2) === 400);
    assert(findCheapestPrice(2, [[0,1,500]], 0, 1, 0) === 500);
    assert(findCheapestPrice(3, [[0,1,100],[1,2,50]], 1, 1, 1) === 0);
    assert(findCheapestPrice(3, [[0,1,100]], 0, 2, 5) === -1);
    // perf
    const bigFlights = Array.from({ length: 9_999 }, (_, i) => [i, i + 1, i + 1]);
    const t0 = performance.now();
    findCheapestPrice(10_000, bigFlights, 0, 9_999, 10_000);
    console.log(`perf cheapest-flights 10000 nodes chain k=10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
